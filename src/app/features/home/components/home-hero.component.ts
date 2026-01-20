import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiSectionBadgeComponent } from '../../../shared/ui/section-badge.component';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, UiSectionBadgeComponent],
  templateUrl: './home-hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeroComponent {}
