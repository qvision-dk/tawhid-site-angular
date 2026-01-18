import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrayerTimesComponent } from '../../../shared/widgets/prayer-times.component';
import { UpcomingWidgetComponent } from '../../../shared/widgets/upcoming-widget.component';

@Component({
  selector: 'app-activities-sidebar',
  standalone: true,
  imports: [CommonModule, PrayerTimesComponent, UpcomingWidgetComponent],
  host: {
    class: 'lg:col-span-4'
  },
  template: `
    <app-prayer-times></app-prayer-times>
    <div class="mt-8">
      <app-upcoming-widget></app-upcoming-widget>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesSidebarComponent {}
