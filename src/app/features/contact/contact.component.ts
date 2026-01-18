import { Component, signal, computed, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
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
  readonly isFormInvalid = signal(true);
  readonly showNameError = signal(false);
  readonly showEmailError = signal(false);
  readonly showMessageError = signal(false);

  readonly isSubmitDisabled = computed(() => this.isFormInvalid());

  constructor() {
    this.contactForm = this.contactService.createContactForm();
    
    // Update signals when form values or status changes
    const updateFormState = () => {
      this.isFormInvalid.set(this.contactForm.invalid);
      
      const nameControl = this.contactForm.get('name');
      const emailControl = this.contactForm.get('email');
      const messageControl = this.contactForm.get('message');
      
      this.showNameError.set(nameControl ? nameControl.touched && nameControl.invalid : false);
      this.showEmailError.set(emailControl ? emailControl.touched && emailControl.invalid : false);
      this.showMessageError.set(messageControl ? messageControl.touched && messageControl.invalid : false);
      
      this.cdr.markForCheck();
    };
    
    this.contactForm.valueChanges.subscribe(updateFormState);
    this.contactForm.statusChanges.subscribe(updateFormState);
    
    // Also listen to individual control changes
    this.contactForm.get('name')?.statusChanges.subscribe(updateFormState);
    this.contactForm.get('email')?.statusChanges.subscribe(updateFormState);
    this.contactForm.get('message')?.statusChanges.subscribe(updateFormState);
    
    // Set initial state
    updateFormState();
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.contactService.sendViaMailto(this.contactForm.value);
      this.successMessage.set(true);
      this.contactForm.reset();
      this.showNameError.set(false);
      this.showEmailError.set(false);
      this.showMessageError.set(false);
      this.cdr.markForCheck();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.successMessage.set(false);
        this.cdr.markForCheck();
      }, 5000);
    } else {
      this.contactForm.markAllAsTouched();
      // Update error signals after marking all as touched
      const nameControl = this.contactForm.get('name');
      const emailControl = this.contactForm.get('email');
      const messageControl = this.contactForm.get('message');
      
      this.showNameError.set(nameControl ? nameControl.invalid : false);
      this.showEmailError.set(emailControl ? emailControl.invalid : false);
      this.showMessageError.set(messageControl ? messageControl.invalid : false);
      this.cdr.markForCheck();
    }
  }
}