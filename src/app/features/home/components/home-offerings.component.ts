import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiSectionBadgeComponent } from '../../../shared/ui/section-badge.component';

@Component({
  selector: 'app-home-offerings',
  standalone: true,
  imports: [CommonModule, UiSectionBadgeComponent],
  templateUrl: './home-offerings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeOfferingsComponent {}
