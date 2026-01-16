import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-offerings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Offerings Grid -->
    <div class="space-y-8">
      <div class="space-y-4">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
          <span class="material-icons-round text-sm">volunteer_activism</span> Hvad vi tilbyder
        </span>
        <h2 class="text-4xl font-display font-bold text-secondary dark:text-white">Aktiviteter for alle</h2>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          Vi har skabt et miljø hvor der er plads til alle, uanset alder og baggrund. Udforsk vores mange tilbud.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="group bg-blue-50/50 dark:bg-blue-900/5 p-8 rounded-[2rem] border border-blue-100 dark:border-blue-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform duration-300">
            <span class="material-icons-round text-3xl">menu_book</span>
          </div>
          <h3 class="text-xl font-bold mb-3 text-slate-900 dark:text-white">Undervisning</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Styrk din viden om islam, sprog og kultur i et åbent og respektfuldt læringsmiljø med kompetente undervisere.
          </p>
        </div>

        <div class="group bg-emerald-50/50 dark:bg-emerald-900/5 p-8 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
            <span class="material-icons-round text-3xl">groups</span>
          </div>
          <h3 class="text-xl font-bold mb-3 text-slate-900 dark:text-white">Ungdomsaktiviteter</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Et bredt udvalg af sociale og faglige aktiviteter der giver plads til udvikling, venskaber og gode oplevelser.
          </p>
        </div>

        <div class="group bg-amber-50/50 dark:bg-amber-900/5 p-8 rounded-[2rem] border border-amber-100 dark:border-amber-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 transition-transform duration-300">
            <span class="material-icons-round text-3xl">mosque</span>
          </div>
          <h3 class="text-xl font-bold mb-3 text-slate-900 dark:text-white">Fredagssammenkomst</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Hver uge samles vi til fællesskab, khutbah, refleksion og samhørighed. Alle er velkomne.
          </p>
        </div>

        <div class="group bg-pink-50/50 dark:bg-pink-900/5 p-8 rounded-[2rem] border border-pink-100 dark:border-pink-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-6 text-pink-500 group-hover:scale-110 transition-transform duration-300">
            <span class="material-icons-round text-3xl">favorite</span>
          </div>
          <h3 class="text-xl font-bold mb-3 text-slate-900 dark:text-white">Hygge & Fællesskab</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Uformelle møder, fællesspisning og hygge hvor vi styrker båndene i vores fællesskab på tværs af generationer.
          </p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeOfferingsComponent {}
