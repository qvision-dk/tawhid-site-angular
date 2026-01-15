import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:py-6">
      <nav class="max-w-6xl mx-auto glass-nav rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-300">
        
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-secondary dark:bg-primary rounded-full flex items-center justify-center text-white transition-colors duration-300">
            <span class="material-icons-round text-2xl group-hover:rotate-12 transition-transform text-primary dark:text-secondary">nights_stay</span>
          </div>
          <div>
            <h1 class="font-bold text-lg leading-none text-secondary dark:text-white">Tawhid</h1>
            <p class="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">Islamisk Trossamfund</p>
          </div>
        </a>

        <!-- Desktop Menu -->
        <ul class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <li>
            <a routerLink="/" routerLinkActive="text-primary font-bold" [routerLinkActiveOptions]="{exact: true}" class="hover:text-primary transition-colors relative group py-2">
              Home
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li>
            <a routerLink="/aktiviteter" routerLinkActive="text-primary font-bold" class="hover:text-primary transition-colors relative group py-2">
              Aktiviteter
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li>
            <a routerLink="/om-os" routerLinkActive="text-primary font-bold" class="hover:text-primary transition-colors relative group py-2">
              Om Tawhid
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li>
            <a routerLink="/medlemmer" routerLinkActive="text-primary font-bold" class="hover:text-primary transition-colors relative group py-2">
              Medlemmer
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li>
            <a routerLink="/kontakt" routerLinkActive="text-primary font-bold" class="hover:text-primary transition-colors relative group py-2">
              Kontakt
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
        </ul>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <button (click)="themeService.toggle()" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
            @if(themeService.isDark()) {
              <span class="material-icons-round">light_mode</span>
            } @else {
              <span class="material-icons-round">dark_mode</span>
            }
          </button>
          
          <a routerLink="/medlemmer" class="hidden sm:block bg-primary hover:bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition-all duration-300">
            Bliv medlem
          </a>
          
          <!-- Mobile Menu Button (simplified for this demo) -->
          <button class="md:hidden w-10 h-10 flex items-center justify-center text-secondary dark:text-white">
            <span class="material-icons-round">menu</span>
          </button>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent {
  themeService = inject(ThemeService);
}