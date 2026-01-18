import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activities-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-12 animate-fade-in">
      <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
        <span class="material-icons-round text-sm">event_available</span> Aktiviteter
      </span>
      <h2 class="text-5xl md:text-6xl font-display font-extrabold text-slate-900 dark:text-white mb-6">Vores Aktiviteter</h2>
      <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
        Vi tilbyder en bred vifte af aktiviteter for alle aldersgrupper. Her er et overblik over vores ugentlige programmer i hjertet af København.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesHeroComponent {}
