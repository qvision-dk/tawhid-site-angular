import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PrayerTimesComponent } from '../../shared/widgets/prayer-times.component';
import { UpcomingWidgetComponent } from '../../shared/widgets/upcoming-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PrayerTimesComponent, UpcomingWidgetComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {}