import { Component, signal, ChangeDetectionStrategy, inject, effect, HostListener, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-menu.component.html'
})
export class UserMenuComponent implements AfterViewInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly elementRef = inject(ElementRef);
  
  readonly isOpen = signal(false);
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly user = this.authService.user;

  constructor() {
    effect(() => {
      if (!this.isAuthenticated()) {
        this.isOpen.set(false);
      }
    });
  }

  ngAfterViewInit(): void {
    // Close menu on outside click
    document.addEventListener('click', this.handleClickOutside);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside);
  }

  private handleClickOutside = (event: MouseEvent): void => {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  };

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isOpen.update(v => !v);
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }

  async handleLogout(): Promise<void> {
    await this.authService.signOut();
    this.closeMenu();
  }
}
