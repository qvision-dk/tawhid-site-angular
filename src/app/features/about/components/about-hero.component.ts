import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiSectionBadgeComponent } from '../../../shared/ui/section-badge.component';

@Component({
  selector: 'app-about-hero',
  standalone: true,
  imports: [CommonModule, UiSectionBadgeComponent],
  template: `
    <!-- Header -->
    <section class="space-y-6">
      <app-ui-section-badge icon="auto_awesome">Om os</app-ui-section-badge>
      <h1 class="font-display text-5xl md:text-6xl text-secondary dark:text-white font-extrabold leading-tight">
        Om Tawhid Islamisk <br/>
        <span class="text-primary italic">Trossamfund</span>
      </h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
        Lær mere om vores mission, værdier og det fællesskab, vi har bygget op gennem årene i hjertet af København.
      </p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutHeroComponent {}
