import { Component, signal, computed, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ContactHeroComponent } from './components/contact-hero.component';
import { ContactInfoComponent } from './components/contact-info.component';
import { ContactFormComponent } from './components/contact-form.component';
import { PrayerTimesComponent } from '../../shared/widgets/prayer-times.component';
import { UpcomingWidgetComponent } from '../../shared/widgets/upcoming-widget.component';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ContactHeroComponent, ContactInfoComponent, ContactFormComponent, PrayerTimesComponent, UpcomingWidgetComponent],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ContactService]
})
export class ContactComponent {
  private readonly contactService = inject(ContactService);
  private readonly cdr = inject(ChangeDetectorRef);
  
  readonly contactForm: FormGroup;
  readonly successMessage = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly isFormInvalid = signal(true);
  readonly showNameError = signal(false);
  readonly showEmailError = signal(false);
  readonly showSubjectError = signal(false);
  readonly showMessageError = signal(false);

  readonly isSubmitDisabled = computed(() => this.isFormInvalid() || this.isSubmitting());

  constructor() {
    this.contactForm = this.contactService.createContactForm();
    
    // Update signals when form values or status changes
    const updateFormState = () => {
      this.isFormInvalid.set(this.contactForm.invalid);
      
      const nameControl = this.contactForm.get('name');
      const emailControl = this.contactForm.get('email');
      const subjectControl = this.contactForm.get('subject');
      const messageControl = this.contactForm.get('message');
      
      this.showNameError.set(nameControl ? nameControl.touched && nameControl.invalid : false);
      this.showEmailError.set(emailControl ? emailControl.touched && emailControl.invalid : false);
      this.showSubjectError.set(subjectControl ? subjectControl.touched && subjectControl.invalid : false);
      this.showMessageError.set(messageControl ? messageControl.touched && messageControl.invalid : false);
      
      this.cdr.markForCheck();
    };
    
    this.contactForm.valueChanges.subscribe(updateFormState);
    this.contactForm.statusChanges.subscribe(updateFormState);
    
    // Also listen to individual control changes
    this.contactForm.get('name')?.statusChanges.subscribe(updateFormState);
    this.contactForm.get('email')?.statusChanges.subscribe(updateFormState);
    this.contactForm.get('subject')?.statusChanges.subscribe(updateFormState);
    this.contactForm.get('message')?.statusChanges.subscribe(updateFormState);
    
    // Set initial state
    updateFormState();
  }

  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      switch (controlName) {
        case 'name': return 'Navn er påkrævet';
        case 'email': return 'Email er påkrævet';
        case 'subject': return 'Emne er påkrævet';
        case 'message': return 'Besked er påkrævet';
        default: return 'Dette felt er påkrævet';
      }
    }

    if (errors['email']) {
      return 'Indtast en gyldig email-adresse';
    }

    if (errors['minlength']) {
      const required = errors['minlength'].requiredLength;
      switch (controlName) {
        case 'name': return `Skriv mindst ${required} tegn`;
        case 'subject': return `Skriv mindst ${required} tegn`;
        case 'message': return `Skriv mindst ${required} tegn`;
        default: return `Skriv mindst ${required} tegn`;
      }
    }

    if (errors['maxlength']) {
      const required = errors['maxlength'].requiredLength;
      switch (controlName) {
        case 'name': return `Maksimalt ${required} tegn`;
        case 'email': return `Maksimalt ${required} tegn`;
        case 'subject': return `Maksimalt ${required} tegn`;
        case 'message': return `Maksimalt ${required} tegn`;
        default: return `Maksimalt ${required} tegn`;
      }
    }

    return '';
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);
      this.cdr.markForCheck();

      try {
        const formValue = this.contactForm.value;
        await this.contactService.saveMessage({
          name: formValue.name,
          email: formValue.email,
          subject: formValue.subject,
          message: formValue.message
        });
        
        this.successMessage.set(true);
        this.contactForm.reset();
        this.showNameError.set(false);
        this.showEmailError.set(false);
        this.showSubjectError.set(false);
        this.showMessageError.set(false);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.successMessage.set(false);
          this.cdr.markForCheck();
        }, 5000);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Der opstod en fejl ved afsendelse af beskeden. Prøv venligst igen.';
        this.errorMessage.set(message);
        console.error('Error saving contact message:', error);
      } finally {
        this.isSubmitting.set(false);
        this.cdr.markForCheck();
      }
    } else {
      this.contactForm.markAllAsTouched();
      // Update error signals after marking all as touched
      const nameControl = this.contactForm.get('name');
      const emailControl = this.contactForm.get('email');
      const subjectControl = this.contactForm.get('subject');
      const messageControl = this.contactForm.get('message');
      
      this.showNameError.set(nameControl ? nameControl.invalid : false);
      this.showEmailError.set(emailControl ? emailControl.invalid : false);
      this.showSubjectError.set(subjectControl ? subjectControl.invalid : false);
      this.showMessageError.set(messageControl ? messageControl.invalid : false);
      this.cdr.markForCheck();
    }
  }
}