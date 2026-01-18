import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Header -->
    <section>
      <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
        <span class="material-icons-round text-sm">stars</span> Medlemskab
      </span>
      <h2 class="font-display text-6xl md:text-7xl text-secondary dark:text-white mb-6">Bliv Medlem</h2>
      <p class="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
        Støt fællesskabet og få adgang til eksklusive fordele. Vi ser frem til at byde dig velkommen.
      </p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersHeroComponent {}
