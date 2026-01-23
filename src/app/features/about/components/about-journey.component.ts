import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-journey',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-journey.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutJourneyComponent {}
