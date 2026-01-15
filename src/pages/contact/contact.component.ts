import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrayerTimesComponent } from '../../components/widgets/prayer-times.component';
import { UpcomingWidgetComponent } from '../../components/widgets/upcoming-widget.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrayerTimesComponent, UpcomingWidgetComponent],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = signal(false);
  successMessage = signal(false);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
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