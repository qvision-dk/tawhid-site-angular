import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiSectionBadgeComponent } from '../../../shared/ui/section-badge.component';

@Component({
  selector: 'app-members-hero',
  standalone: true,
  imports: [CommonModule, UiSectionBadgeComponent],
  template: `
    <!-- Header -->
    <section>
      <app-ui-section-badge icon="stars" class="mb-6">Medlemskab</app-ui-section-badge>
      <h2 class="font-display text-6xl md:text-7xl text-secondary dark:text-white mb-6">Bliv Medlem</h2>
      <p class="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
        Støt fællesskabet og få adgang til eksklusive fordele. Vi ser frem til at byde dig velkommen.
      </p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersHeroComponent {}
