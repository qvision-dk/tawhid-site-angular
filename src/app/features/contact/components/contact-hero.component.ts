import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiSectionBadgeComponent } from '../../../shared/ui/section-badge.component';

@Component({
  selector: 'app-contact-hero',
  standalone: true,
  imports: [CommonModule, UiSectionBadgeComponent],
  template: `
    <!-- Header -->
    <header class="space-y-4">
      <app-ui-section-badge icon="chat_bubble_outline">Kontakt</app-ui-section-badge>
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
