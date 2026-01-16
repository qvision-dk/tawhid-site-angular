import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrayerTimesComponent } from '../../../shared/widgets/prayer-times.component';
import { UpcomingWidgetComponent } from '../../../shared/widgets/upcoming-widget.component';

@Component({
  selector: 'app-home-sidebar',
  standalone: true,
  imports: [CommonModule, PrayerTimesComponent, UpcomingWidgetComponent],
  host: {
    class: 'lg:col-span-4'
  },
  template: `
    <!-- Sidebar (4 cols) -->
    <aside class="lg:col-span-4">
      <app-prayer-times></app-prayer-times>
      <div class="mt-8">
        <app-upcoming-widget></app-upcoming-widget>
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeSidebarComponent {}
