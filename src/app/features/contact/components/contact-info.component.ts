import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Info Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100/50 dark:border-blue-800/20 flex items-center gap-6 group hover:shadow-lg transition-all">
        <div class="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
          <span class="material-icons-round">location_on</span>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Adresse</p>
          <h3 class="font-bold text-secondary dark:text-white">Masjid Tawhid, København</h3>
        </div>
      </div>
      <div class="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100/50 dark:border-emerald-800/20 flex items-center gap-6 group hover:shadow-lg transition-all">
        <div class="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
          <span class="material-icons-round">phone</span>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Telefon</p>
          <h3 class="font-bold text-secondary dark:text-white">+45 12 34 56 78</h3>
        </div>
      </div>
      <div class="p-8 bg-orange-50 dark:bg-orange-900/10 rounded-[2rem] border border-orange-100/50 dark:border-orange-800/20 flex items-center gap-6 group hover:shadow-lg transition-all">
        <div class="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
          <span class="material-icons-round">mail</span>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Email</p>
          <h3 class="font-bold text-secondary dark:text-white">info@tawhid.dk</h3>
        </div>
      </div>
      <div class="p-8 bg-purple-50 dark:bg-purple-900/10 rounded-[2rem] border border-purple-100/50 dark:border-purple-800/20 flex items-center gap-6 group hover:shadow-lg transition-all">
        <div class="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
          <span class="material-icons-round">schedule</span>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Åbningstider</p>
          <h3 class="font-bold text-secondary dark:text-white">Dagligt: 08:00 - 21:00</h3>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactInfoComponent {}
