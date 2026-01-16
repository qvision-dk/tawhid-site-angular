import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeroComponent } from './components/home-hero.component';
import { HomeOfferingsComponent } from './components/home-offerings.component';
import { HomeCtaComponent } from './components/home-cta.component';
import { HomeSidebarComponent } from './components/home-sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HomeHeroComponent, HomeOfferingsComponent, HomeCtaComponent, HomeSidebarComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}