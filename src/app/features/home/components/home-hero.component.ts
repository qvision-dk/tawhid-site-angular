import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Card -->
    <div class="relative rounded-[3rem] overflow-hidden shadow-2xl min-h-[80vh] flex items-center group">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
        <img src="/assets/images/home/hero-bg.jpg"
        alt="Islamic Night Sky with Moon" 
        class="w-full h-full object-cover object-top">
        
        <!-- Overlays -->
        <div class="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/60 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-secondary/90 to-transparent"></div>
        <div class="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none"></div>
      </div>

     

      <!-- Content -->
      <div class="relative z-10 p-8 md:p-12 lg:p-16 w-full text-white">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 border border-primary/30 backdrop-blur-md rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-8 shadow-lg shadow-black/10">
          <span class="material-icons-round text-sm animate-pulse">auto_awesome</span>
          Velkommen til vores fællesskab
        </div>
        
        

        <h1 class="font-display text-5xl md:text-7xl mb-8 leading-tight drop-shadow-lg max-w-2xl">
          Tawhid Islamisk <br/>
          <span class="text-primary italic">Trossamfund</span>
        </h1>
        
        <p class="text-lg md:text-xl text-slate-200 mb-10 max-w-lg leading-relaxed font-medium drop-shadow-md">
          Et trygt, aktivt og meningsfuldt fællesskab for børn, unge og voksne i hjertet af København.
        </p>
        
        <div class="flex flex-wrap gap-4 mb-16">
          <button routerLink="/medlemmer" class="bg-primary hover:bg-amber-600 text-secondary font-bold px-8 py-4 rounded-full flex items-center gap-2 transition-all shadow-xl shadow-primary/20 transform hover:-translate-y-1">
            Bliv medlem <span class="material-icons-round">arrow_forward</span>
          </button>
          <button routerLink="/om-os" class="bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white px-8 py-4 rounded-full font-medium transition-all transform hover:-translate-y-1">
            Lær mere om os
          </button>
        </div>

        <div class="grid grid-cols-3 gap-8 border-t border-white/10 pt-8 max-w-lg">
          <div>
            <p class="text-3xl font-display text-primary font-bold">500+</p>
            <p class="text-sm text-slate-400 mt-1">Medlemmer</p>
          </div>
          <div>
            <p class="text-3xl font-display text-primary font-bold">15+</p>
            <p class="text-sm text-slate-400 mt-1">Ugentlige aktiviteter</p>
          </div>
          <div>
            <p class="text-3xl font-display text-primary font-bold">10+</p>
            <p class="text-sm text-slate-400 mt-1">År i København</p>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeroComponent {}
