import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  createContactForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required]
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
        email: formValue.email.trim(),
        subject: formValue.subject?.trim() || `Kontakt fra ${formValue.name.trim()}`,
        message: formValue.message.trim(),
        status: 'new'
      });

    if (error) {
      throw new Error(`Failed to save message: ${error.message}`);
    }
  }
}
