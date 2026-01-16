import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Header -->
    <section class="space-y-6">
      <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
        <span class="material-icons-round text-sm">auto_awesome</span> Om os
      </span>
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
