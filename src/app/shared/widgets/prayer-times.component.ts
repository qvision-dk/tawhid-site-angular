import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prayer-times.component.html'
})
export class PrayerTimesComponent {
  prayers = [
    { name: 'Fajr', arabic: 'الفجر', time: '05:41' },
    { name: 'Shoroq', arabic: 'الشروق', time: '08:39' },
    { name: 'Dhuhr', arabic: 'الظهر', time: '12:14' },
    { name: 'Asr', arabic: 'العصر', time: '13:34' },
    { name: 'Maghrib', arabic: 'المغرب', time: '15:49' },
  ];
}