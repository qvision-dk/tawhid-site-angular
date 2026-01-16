import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-values',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Values Grid -->
    <section class="space-y-8">
      <div class="text-center md:text-left">
        <h2 class="font-display text-3xl text-secondary dark:text-white font-bold">Vores Værdier</h2>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="p-8 rounded-[2rem] bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 group hover:shadow-lg transition-all">
          <div class="w-14 h-14 bg-white dark:bg-rose-900/30 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            <span class="material-icons-round text-rose-500 text-2xl">favorite</span>
          </div>
          <h3 class="font-bold text-xl mb-3 text-secondary dark:text-white">Fællesskab</h3>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
            Vi tror på styrken i fællesskab og arbejder for at skabe et varmt og inkluderende miljø for alle.
          </p>
        </div>

        <div class="p-8 rounded-[2rem] bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 group hover:shadow-lg transition-all">
          <div class="w-14 h-14 bg-white dark:bg-blue-900/30 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            <span class="material-icons-round text-blue-500 text-2xl">school</span>
          </div>
          <h3 class="font-bold text-xl mb-3 text-secondary dark:text-white">Uddannelse</h3>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
            Vi prioriterer læring og personlig udvikling gennem islamisk undervisning og kulturelle aktiviteter.
          </p>
        </div>

        <div class="p-8 rounded-[2rem] bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 group hover:shadow-lg transition-all">
          <div class="w-14 h-14 bg-white dark:bg-emerald-900/30 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            <span class="material-icons-round text-emerald-500 text-2xl">groups</span>
          </div>
          <h3 class="font-bold text-xl mb-3 text-secondary dark:text-white">Mangfoldighed</h3>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
            Vi omfavner alle baggrunde og arbejder for at bygge broer mellem forskellige kulturer og folk.
          </p>
        </div>

        <div class="p-8 rounded-[2rem] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 group hover:shadow-lg transition-all">
          <div class="w-14 h-14 bg-white dark:bg-amber-900/30 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            <span class="material-icons-round text-amber-500 text-2xl">shield</span>
          </div>
          <h3 class="font-bold text-xl mb-3 text-secondary dark:text-white">Respekt</h3>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
            Gensidig respekt og forståelse er grundlaget for alt, hvad vi gør i vores trossamfund.
          </p>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutValuesComponent {}
