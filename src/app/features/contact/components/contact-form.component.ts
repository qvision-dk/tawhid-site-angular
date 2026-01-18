import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Contact Form -->
    <div class="mt-12 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden">
      <div class="islamic-pattern absolute inset-0 opacity-50 pointer-events-none"></div>
      
      <div class="relative z-10 space-y-10">
        <div class="space-y-4">
          <div class="w-16 h-1 bg-primary rounded-full"></div>
          <h2 class="text-4xl font-display font-bold text-secondary dark:text-white">Send en besked</h2>
          <p class="text-slate-500 dark:text-slate-400">Udfyld formularen og vi vender tilbage hurtigst muligt.</p>
        </div>
        
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-3">
            <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Navn</label>
            <input formControlName="name" class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all" placeholder="Dit navn" type="text"/>
            @if(showNameError) {
              <p class="text-red-500 text-xs">Navn er påkrævet</p>
            }
          </div>
          
          <div class="space-y-3">
            <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
            <input formControlName="email" class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all" placeholder="din@email.dk" type="email"/>
            @if(showEmailError) {
              <p class="text-red-500 text-xs">Gyldig email er påkrævet</p>
            }
          </div>
          
          <div class="md:col-span-2 space-y-3">
            <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Emne</label>
            <input formControlName="subject" class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all" placeholder="Hvad handler din henvendelse om?" type="text"/>
          </div>
          
          <div class="md:col-span-2 space-y-3">
            <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Besked</label>
            <textarea formControlName="message" class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all" placeholder="Skriv din besked her..." rows="6"></textarea>
             @if(showMessageError) {
              <p class="text-red-500 text-xs">Besked er påkrævet</p>
            }
          </div>
          
          <div class="md:col-span-2 pt-4">
            <button [disabled]="isSubmitDisabled" class="group relative bg-primary hover:bg-amber-600 disabled:bg-slate-400 text-secondary font-bold py-5 px-10 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center gap-3 active:scale-[0.98] disabled:active:scale-100" type="submit">
              <span>Send Besked</span>
              <span class="material-icons-round group-hover:translate-x-1 group-disabled:translate-x-0 transition-transform">send</span>
            </button>
            @if(successMessage) {
              <p class="text-green-500 mt-4 text-sm font-bold">Tak for din besked! Vi vender tilbage hurtigst muligt.</p>
            }
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) showNameError!: boolean;
  @Input({ required: true }) showEmailError!: boolean;
  @Input({ required: true }) showMessageError!: boolean;
  @Input({ required: true }) isSubmitDisabled!: boolean;
  @Input({ required: true }) successMessage!: boolean;
  @Output() submitForm = new EventEmitter<void>();

  onSubmit(): void {
    this.submitForm.emit();
  }
}
