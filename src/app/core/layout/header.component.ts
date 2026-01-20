import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  readonly isMenuOpen = signal(false);

  readonly links = [
    { path: '/', label: 'Home', exact: true },
    { path: '/aktiviteter', label: 'Aktiviteter', exact: false },
    { path: '/om-os', label: 'Om Tawhid', exact: false },
    { path: '/medlemmer', label: 'Medlemmer', exact: false },
    { path: '/kontakt', label: 'Kontakt', exact: false }
  ];

  readonly menuIcon = computed(() => this.isMenuOpen() ? 'close' : 'menu');

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}