import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface PrayerTime {
  name: string;
  arabic: string;
  time: string;
  timestamp?: Date;
}

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
    date: {
      readable: string;
      timestamp: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class PrayerTimesService {
  private readonly apiUrl = 'https://api.aladhan.com/v1/timingsByCity';
  
  readonly prayers = signal<PrayerTime[]>([]);
  readonly nextPrayer = signal<PrayerTime | null>(null);
  readonly currentDate = signal<string>('');
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadPrayerTimes(city: string = 'Copenhagen', country: string = 'Denmark', date?: string): void {
    this.loading.set(true);
    this.error.set(null);

    const params = new HttpParams()
      .set('city', city)
      .set('country', country)
      .set('method', '2') // ISNA method
      .set('school', '0'); // Shafi'i school

    if (date) {
      params.set('date', date);
    }

    this.http.get<PrayerTimesResponse>(this.apiUrl, { params })
      .pipe(
        map(response => this.mapResponseToPrayers(response)),
        catchError(error => {
          console.error('Error fetching prayer times:', error);
          this.error.set('Kunne ikke hente bønnetider');
          return of([]);
        })
      )
      .subscribe({
        next: (prayers) => {
          this.prayers.set(prayers);
          this.calculateNextPrayer(prayers);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  private mapResponseToPrayers(response: PrayerTimesResponse): PrayerTime[] {
    if (response.code !== 200 || !response.data) {
      throw new Error('Invalid API response');
    }

    const timings = response.data.timings;
    const dateStr = response.data.date.readable;
    this.currentDate.set(dateStr);

    const prayerMap: Record<string, { name: string; arabic: string }> = {
      Fajr: { name: 'Fajr', arabic: 'الفجر' },
      Sunrise: { name: 'Shoroq', arabic: 'الشروق' },
      Dhuhr: { name: 'Dhuhr', arabic: 'الظهر' },
      Asr: { name: 'Asr', arabic: 'العصر' },
      Maghrib: { name: 'Maghrib', arabic: 'المغرب' },
      Isha: { name: 'Isha', arabic: 'العشاء' }
    };

    const prayers: PrayerTime[] = [];
    const now = new Date();

    for (const [key, value] of Object.entries(prayerMap)) {
      const timeStr = timings[key as keyof typeof timings];
      if (timeStr) {
        // Parse time string (format: "HH:mm" or "HH:mm:ss")
        const [hours, minutes] = timeStr.split(':').map(Number);
        const timestamp = new Date(now);
        timestamp.setHours(hours, minutes, 0, 0);
        
        // Format time as HH:mm
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        prayers.push({
          name: value.name,
          arabic: value.arabic,
          time: formattedTime,
          timestamp
        });
      }
    }

    return prayers;
  }

  private calculateNextPrayer(prayers: PrayerTime[]): void {
    const now = new Date();
    let nextPrayer: PrayerTime | null = null;
    let minDiff = Infinity;

    for (const prayer of prayers) {
      if (!prayer.timestamp) continue;

      const diff = prayer.timestamp.getTime() - now.getTime();
      
      // If prayer is in the future and closer than current next prayer
      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
        nextPrayer = prayer;
      }
    }

    // If no future prayer found today, use first prayer of next day (Fajr)
    if (!nextPrayer && prayers.length > 0) {
      nextPrayer = prayers[0]; // Fajr is typically first
    }

    this.nextPrayer.set(nextPrayer);
  }
}
