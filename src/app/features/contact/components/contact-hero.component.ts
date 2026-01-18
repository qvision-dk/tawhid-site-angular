import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Header -->
    <header class="space-y-4">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
        <span class="material-icons-round text-sm">chat_bubble_outline</span> Kontakt
      </div>
      <h1 class="text-5xl lg:text-7xl font-display font-bold text-secondary dark:text-white leading-[1.1]">
        Kontakt Os
      </h1>
      <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
        Vi er altid glade for at høre fra dig. Kontakt os med spørgsmål, forslag eller bare for at sige hej.
      </p>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactHeroComponent {}
