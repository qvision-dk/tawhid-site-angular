import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-next-prayer-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './next-prayer-countdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NextPrayerCountdownComponent {
  @Input() countdown: CountdownTime | null = null;
  @Input() prayerName: string = '';
  @Input() prayerTime: string = '';
}
