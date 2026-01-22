import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) showNameError!: boolean;
  @Input({ required: true }) showEmailError!: boolean;
  @Input({ required: true }) showSubjectError!: boolean;
  @Input({ required: true }) showMessageError!: boolean;
  @Input({ required: true }) nameErrorMessage!: string;
  @Input({ required: true }) emailErrorMessage!: string;
  @Input({ required: true }) subjectErrorMessage!: string;
  @Input({ required: true }) messageErrorMessage!: string;
  @Input({ required: true }) isSubmitDisabled!: boolean;
  @Input({ required: true }) successMessage!: boolean;
  @Input() errorMessage: string | null = null;
  @Input() isSubmitting: boolean = false;
  @Output() submitForm = new EventEmitter<void>();

  onSubmit(): void {
    this.submitForm.emit();
  }
}
