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
  private lastLoadedDate: string | null = null;
  
  readonly prayers = signal<PrayerTime[]>([]);
  readonly nextPrayer = signal<PrayerTime | null>(null);
  readonly currentDate = signal<string>('');
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadPrayerTimes(city: string = 'Copenhagen', country: string = 'Denmark', date?: string): void {
    // Check if we already have data for today
    const today = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (this.prayers().length > 0 && this.lastLoadedDate === today && !date) {
      // Data already loaded for today, just recalculate next prayer
      this.calculateNextPrayer(this.prayers());
      return;
    }

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
          this.lastLoadedDate = today;
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

  /**
   * Pure calculation method to determine the next prayer.
   * If all prayers for today have passed, returns tomorrow's Fajr.
   * Shoroq (sunrise) is excluded from next prayer calculation.
   */
  getNextPrayer(prayers: PrayerTime[], now: Date): PrayerTime | null {
    if (prayers.length === 0) return null;

    let nextPrayer: PrayerTime | null = null;
    let minDiff = Infinity;

    // Find the next prayer from today's list (excluding Shoroq)
    for (const prayer of prayers) {
      if (!prayer.timestamp) continue;
      
      // Skip Shoroq (sunrise) - it's not a prayer time
      if (prayer.name === 'Shoroq') continue;

      const diff = prayer.timestamp.getTime() - now.getTime();
      
      // If prayer is in the future and closer than current next prayer
      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
        nextPrayer = prayer;
      }
    }

    // If no future prayer found today, calculate tomorrow's Fajr
    if (!nextPrayer && prayers.length > 0) {
      const fajr = prayers.find(p => p.name === 'Fajr');
      if (fajr && fajr.timestamp) {
        // Create a copy with timestamp set to tomorrow
        const tomorrowFajr: PrayerTime = {
          ...fajr,
          timestamp: new Date(fajr.timestamp.getTime() + 24 * 60 * 60 * 1000)
        };
        return tomorrowFajr;
      }
      // Fallback to first prayer if Fajr not found
      return prayers[0];
    }

    return nextPrayer;
  }

  /**
   * Pure calculation method to get time until target time.
   * Returns hours, minutes, seconds. Never returns negative values.
   */
  getTimeUntil(targetTime: Date, now: Date): { hours: number; minutes: number; seconds: number } {
    const diff = Math.max(0, targetTime.getTime() - now.getTime());
    
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  }

  private calculateNextPrayer(prayers: PrayerTime[]): void {
    const now = new Date();
    const next = this.getNextPrayer(prayers, now);
    this.nextPrayer.set(next);
  }
}
