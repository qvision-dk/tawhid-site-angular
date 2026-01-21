import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrayerTimesService } from '../../core/services/prayer-times.service';

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prayer-times.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrayerTimesComponent implements OnInit {
  private readonly prayerTimesService = inject(PrayerTimesService);

  readonly prayers = this.prayerTimesService.prayers;
  readonly nextPrayer = this.prayerTimesService.nextPrayer;
  readonly currentDate = this.prayerTimesService.currentDate;
  readonly loading = this.prayerTimesService.loading;
  readonly error = this.prayerTimesService.error;

  ngOnInit(): void {
    // Load prayer times for Copenhagen, Denmark
    this.prayerTimesService.loadPrayerTimes('Copenhagen', 'Denmark');
  }
}