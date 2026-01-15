import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrayerTimesComponent } from '../../components/widgets/prayer-times.component';
import { UpcomingWidgetComponent } from '../../components/widgets/upcoming-widget.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, PrayerTimesComponent, UpcomingWidgetComponent],
  templateUrl: './about.component.html'
})
export class AboutComponent {}