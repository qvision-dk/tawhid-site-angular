import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PrayerTimesComponent } from '../../components/widgets/prayer-times.component';
import { UpcomingWidgetComponent } from '../../components/widgets/upcoming-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PrayerTimesComponent, UpcomingWidgetComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {}