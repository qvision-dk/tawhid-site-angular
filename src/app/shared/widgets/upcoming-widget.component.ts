import { Component, inject, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivitiesService } from '../../features/activities/data/activities.service';
import { Activity } from '../../features/activities/models/activity.model';

@Component({
  selector: 'app-upcoming-widget',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './upcoming-widget.component.html'
})
export class UpcomingWidgetComponent implements OnInit {
  readonly activitiesService = inject(ActivitiesService);

  readonly upcomingActivities = computed(() => {
    const allActivities = this.activitiesService.activities();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter for upcoming activities:
    // 1. Activities with a future date
    // 2. Weekly activities (repeatBadge === 'weekly')
    // 3. Activities with no date but have weekday (recurring)
    const upcoming = allActivities
      .filter(activity => {
        // Weekly recurring activities are always "upcoming"
        if (activity.repeatBadge === 'weekly' && activity.weekday !== undefined) {
          return true;
        }
        // Activities with a specific date must be in the future
        if (activity.date) {
          const activityDate = new Date(activity.date);
          activityDate.setHours(0, 0, 0, 0);
          return activityDate >= today;
        }
        return false;
      })
      .sort((a, b) => {
        // Sort by date first, then by weekday, then by startTime
        if (a.date && b.date) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (a.weekday !== undefined && b.weekday !== undefined) {
          if (a.weekday !== b.weekday) return a.weekday - b.weekday;
        }
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        return 0;
      })
      .slice(0, 5); // Show max 5 upcoming activities

    return upcoming;
  });

  ngOnInit(): void {
    // Initialize activities service if not already loaded
    if (this.activitiesService.activities().length === 0) {
      this.activitiesService.init();
    }
  }

  getIconForType(typeSlug: string): string {
    if (!typeSlug) return 'event';
    const iconMap: Record<string, string> = {
      'prayer': 'mosque',
      'teaching': 'menu_book',
      'youth': 'groups',
      'community': 'favorite'
    };
    return iconMap[typeSlug.toLowerCase()] || 'event';
  }

  getCardClasses(typeSlug: string): string {
    if (!typeSlug) return 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800';
    const colorMap: Record<string, string> = {
      'prayer': 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20',
      'teaching': 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20',
      'youth': 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20',
      'community': 'bg-pink-50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-900/20'
    };
    return colorMap[typeSlug.toLowerCase()] || 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800';
  }

  getIconBgClass(typeSlug: string): string {
    if (!typeSlug) return 'bg-slate-100 dark:bg-slate-800';
    const colorMap: Record<string, string> = {
      'prayer': 'bg-amber-100 dark:bg-amber-900/30',
      'teaching': 'bg-blue-100 dark:bg-blue-900/30',
      'youth': 'bg-emerald-100 dark:bg-emerald-900/30',
      'community': 'bg-pink-100 dark:bg-pink-900/30'
    };
    return colorMap[typeSlug.toLowerCase()] || 'bg-slate-100 dark:bg-slate-800';
  }

  getIconColorClass(typeSlug: string): string {
    if (!typeSlug) return 'text-slate-500';
    const colorMap: Record<string, string> = {
      'prayer': 'text-amber-500',
      'teaching': 'text-blue-500',
      'youth': 'text-emerald-500',
      'community': 'text-pink-500'
    };
    return colorMap[typeSlug.toLowerCase()] || 'text-slate-500';
  }

  formatDay(activity: Activity): string {
    if (activity.repeatBadge === 'weekly' && activity.weekday !== undefined) {
      const weekdays = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
      return weekdays[activity.weekday] || '';
    }
    if (activity.date) {
      const date = new Date(activity.date);
      return date.toLocaleDateString('da-DK', { weekday: 'long', day: 'numeric', month: 'long' });
    }
    return '';
  }

  formatTime(activity: Activity): string {
    if (activity.startTime && activity.endTime) {
      const start = activity.startTime.substring(0, 5);
      const end = activity.endTime.substring(0, 5);
      return `${start} - ${end}`;
    }
    if (activity.startTime) {
      return activity.startTime.substring(0, 5);
    }
    return '';
  }

  getRepeatBadgeText(repeatBadge?: string): string {
    if (repeatBadge === 'weekly') return 'Ugentlig';
    if (repeatBadge === 'monthly') return 'Månedlig';
    if (repeatBadge === 'yearly') return 'Årlig';
    return '';
  }
}