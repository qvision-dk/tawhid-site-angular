import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class ContactService {
  private readonly recipientEmail = 'info@tawhid.dk';

  constructor(private fb: FormBuilder) {}

  createContactForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required]
    });
  }

  sendViaMailto(formValue: { name: string; email: string; subject: string; message: string }): void {
    const subject = formValue.subject 
      ? encodeURIComponent(formValue.subject)
      : encodeURIComponent(`Kontakt fra ${formValue.name}`);
    
    const body = encodeURIComponent(
      `Navn: ${formValue.name}\n` +
      `Email: ${formValue.email}\n\n` +
      `Besked:\n${formValue.message}`
    );

    const mailtoUrl = `mailto:${this.recipientEmail}?subject=${subject}&body=${body}`;
    
    // Create a temporary anchor element and click it (more reliable than window.location.href)
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
