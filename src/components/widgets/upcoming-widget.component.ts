import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upcoming-widget',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400">
          <span class="material-icons-round">calendar_month</span>
        </div>
        <h4 class="font-bold text-slate-900 dark:text-white">Kommende aktiviteter</h4>
      </div>

      <div class="space-y-4 mb-8">
        <div class="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 group hover:border-amber-200 dark:hover:border-amber-800 transition-colors cursor-pointer">
          <h5 class="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">Fredagssammenkomst</h5>
          <div class="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span class="flex items-center gap-1"><span class="material-icons-round text-xs">event</span> Hver fredag</span>
            <span class="flex items-center gap-1"><span class="material-icons-round text-xs">schedule</span> 13:00</span>
          </div>
        </div>

        <div class="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <h5 class="text-sm font-bold text-slate-900 dark:text-white mb-2">Ungdomsaktiviteter</h5>
          <div class="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span class="flex items-center gap-1"><span class="material-icons-round text-xs">event</span> Lørdag</span>
            <span class="flex items-center gap-1"><span class="material-icons-round text-xs">schedule</span> 15:00</span>
          </div>
        </div>

        <div class="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <h5 class="text-sm font-bold text-slate-900 dark:text-white mb-2">Koranundervisning</h5>
          <div class="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span class="flex items-center gap-1"><span class="material-icons-round text-xs">event</span> Søndag</span>
            <span class="flex items-center gap-1"><span class="material-icons-round text-xs">schedule</span> 10:00</span>
          </div>
        </div>
      </div>

      <button routerLink="/aktiviteter" class="w-full py-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors rounded-2xl text-sm font-bold flex items-center justify-center gap-2 group text-slate-700 dark:text-slate-300">
        Se alle aktiviteter
        <span class="material-icons-round text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </button>
    </div>
  `
})
export class UpcomingWidgetComponent {}