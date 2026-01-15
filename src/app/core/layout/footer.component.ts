import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-16 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-8">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-secondary dark:bg-slate-800 rounded-full flex items-center justify-center text-primary">
              <span class="material-icons-round">nights_stay</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-secondary dark:text-white">Tawhid</h2>
              <p class="text-[10px] tracking-widest uppercase opacity-60 text-slate-500 dark:text-slate-400">Islamisk Trossamfund</p>
            </div>
          </div>
          
          <div class="flex flex-wrap justify-center gap-8 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <a routerLink="/om-os" class="hover:text-primary transition-colors">Om os</a>
            <a routerLink="/kontakt" class="hover:text-primary transition-colors">Kontakt</a>
            <a href="#" class="hover:text-primary transition-colors">Privatlivspolitik</a>
            <a href="#" class="hover:text-primary transition-colors">Vilkår</a>
          </div>
          
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300">
              <span class="material-icons-round text-lg">facebook</span>
            </a>
            <a href="#" class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300">
              <span class="material-icons-round text-lg">camera_alt</span>
            </a>
          </div>
        </div>
        
        <div class="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/50 text-center text-sm text-slate-400">
          © 2026 Tawhid Islamisk Trossamfund. Alle rettigheder forbeholdes.
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}