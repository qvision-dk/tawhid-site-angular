import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiSectionBadgeComponent } from '../../../shared/ui/section-badge.component';

@Component({
  selector: 'app-activities-hero',
  standalone: true,
  imports: [CommonModule, UiSectionBadgeComponent],
  template: `
    <div class="mb-12 animate-fade-in">
      <app-ui-section-badge icon="event_available" class="mb-6">Aktiviteter</app-ui-section-badge>
      <h2 class="text-5xl md:text-6xl font-display font-extrabold text-slate-900 dark:text-white mb-6">Vores Aktiviteter</h2>
      <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
        Vi tilbyder en bred vifte af aktiviteter for alle aldersgrupper. Her er et overblik over vores ugentlige programmer i hjertet af København.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesHeroComponent {}
