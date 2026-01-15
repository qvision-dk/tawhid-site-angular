import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrayerTimesComponent } from '../../shared/widgets/prayer-times.component';
import { UpcomingWidgetComponent } from '../../shared/widgets/upcoming-widget.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, PrayerTimesComponent, UpcomingWidgetComponent],
  templateUrl: './about.component.html'
})
export class AboutComponent {}