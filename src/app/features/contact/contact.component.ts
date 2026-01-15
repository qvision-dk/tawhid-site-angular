import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { PrayerTimesComponent } from '../../shared/widgets/prayer-times.component';
import { UpcomingWidgetComponent } from '../../shared/widgets/upcoming-widget.component';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrayerTimesComponent, UpcomingWidgetComponent],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ContactService]
})
export class ContactComponent {
  private readonly contactService = inject(ContactService);
  
  readonly contactForm: FormGroup;
  readonly isSubmitting = signal(false);
  readonly successMessage = signal(false);

  readonly nameControl = computed(() => this.contactForm.get('name'));
  readonly emailControl = computed(() => this.contactForm.get('email'));
  readonly messageControl = computed(() => this.contactForm.get('message'));

  readonly showNameError = computed(() => {
    const control = this.nameControl();
    return control ? control.touched && control.invalid : false;
  });

  readonly showEmailError = computed(() => {
    const control = this.emailControl();
    return control ? control.touched && control.invalid : false;
  });

  readonly showMessageError = computed(() => {
    const control = this.messageControl();
    return control ? control.touched && control.invalid : false;
  });

  readonly isFormInvalid = computed(() => this.contactForm.invalid);
  readonly isSubmitDisabled = computed(() => this.isFormInvalid() || this.isSubmitting());

  readonly submitButtonText = computed(() => 
    this.isSubmitting() ? 'Sender...' : 'Send Besked'
  );

  constructor() {
    this.contactForm = this.contactService.createContactForm();
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.successMessage.set(true);
        this.contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => this.successMessage.set(false), 5000);
      }, 1500);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}