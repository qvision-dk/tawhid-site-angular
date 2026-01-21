import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy, signal, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrayerTimesService } from '../../core/services/prayer-times.service';
import { NextPrayerCountdownComponent, CountdownTime } from './next-prayer-countdown.component';

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [CommonModule, NextPrayerCountdownComponent],
  templateUrl: './prayer-times.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrayerTimesComponent implements OnInit, OnDestroy {
  private readonly prayerTimesService = inject(PrayerTimesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  readonly prayers = this.prayerTimesService.prayers;
  readonly nextPrayer = this.prayerTimesService.nextPrayer;
  readonly currentDate = this.prayerTimesService.currentDate;
  readonly loading = this.prayerTimesService.loading;
  readonly error = this.prayerTimesService.error;
  readonly countdown = signal<CountdownTime | null>(null);

  constructor() {
    // Watch for when prayers are loaded and start countdown
    effect(() => {
      const prayersLoaded = this.prayers().length > 0;
      const isLoading = this.loading();
      
      if (prayersLoaded && !isLoading && !this.countdownInterval) {
        this.startCountdown();
      }
    });
  }

  ngOnInit(): void {
    // Load prayer times for Copenhagen, Denmark
    this.prayerTimesService.loadPrayerTimes('Copenhagen', 'Denmark');
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  private startCountdown(): void {
    // Clear any existing interval
    this.stopCountdown();
    
    // Update immediately
    this.updateCountdown();
    
    // Then update every second
    this.countdownInterval = setInterval(() => {
      // Recalculate next prayer in case we've passed all prayers today
      const now = new Date();
      const next = this.prayerTimesService.getNextPrayer(this.prayers(), now);
      if (next) {
        this.prayerTimesService.nextPrayer.set(next);
      }
      
      this.updateCountdown();
      this.cdr.markForCheck();
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  private updateCountdown(): void {
    const next = this.nextPrayer();
    if (!next || !next.timestamp) {
      this.countdown.set(null);
      return;
    }

    const now = new Date();
    const timeUntil = this.prayerTimesService.getTimeUntil(next.timestamp, now);
    
    this.countdown.set({
      hours: timeUntil.hours,
      minutes: timeUntil.minutes,
      seconds: timeUntil.seconds
    });
  }
}