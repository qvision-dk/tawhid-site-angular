import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable()
export class ContactService {
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private supabase: SupabaseClient | null = null;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!environment.supabaseUrl || !environment.supabaseAnonKey) {
      console.warn('Supabase environment variables are not configured. Contact messages will not be saved.');
      return;
    }

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  private trimmedMinLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const trimmed = control.value.trim();
      return trimmed.length < minLength
        ? { minlength: { requiredLength: minLength, actualLength: trimmed.length } }
        : null;
    };
  }

  private trimmedMaxLengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const trimmed = control.value.trim();
      return trimmed.length > maxLength
        ? { maxlength: { requiredLength: maxLength, actualLength: trimmed.length } }
        : null;
    };
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      name: [
        '',
        [
          Validators.required,
          this.trimmedMinLengthValidator(2),
          this.trimmedMaxLengthValidator(100)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          this.trimmedMaxLengthValidator(254)
        ]
      ],
      subject: [
        '',
        [
          Validators.required,
          this.trimmedMinLengthValidator(3),
          this.trimmedMaxLengthValidator(150)
        ]
      ],
      message: [
        '',
        [
          Validators.required,
          this.trimmedMinLengthValidator(10),
          this.trimmedMaxLengthValidator(500)
        ]
      ]
    });
  }

  async saveMessage(formValue: { name: string; email: string; subject: string; message: string }): Promise<void> {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized. Cannot save message.');
    }

    const { error } = await this.supabase
      .from('contact_messages')
      .insert({
        name: formValue.name.trim(),
        email: formValue.email.trim().toLowerCase(),
        subject: formValue.subject.trim(),
        message: formValue.message.trim(),
        status: 'new'
      });

    if (error) {
      throw new Error(`Failed to save message: ${error.message}`);
    }
  }
}
