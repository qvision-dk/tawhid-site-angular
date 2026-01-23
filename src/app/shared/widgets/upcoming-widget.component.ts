import { Component, inject, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivitiesService } from '../../features/activities/data/activities.service';
import { Activity } from '../../features/activities/models/activity.model';
import { getIconFromSlug } from '../../features/activities/models/activity-icon.model';

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
    // Initialize activities service (service handles caching internally)
    this.activitiesService.init();
  }

  getIconForActivity(activity: Activity): string {
    const iconData = getIconFromSlug(activity.iconSlug);
    return iconData.materialIcon;
  }

  getCardClasses(activity: Activity): string {
    const iconData = getIconFromSlug(activity.iconSlug);
    // Use a lighter version for card background
    const bgClass = iconData.colorClass.split(' ')[0];
    const darkBgClass = iconData.colorClass.split(' ').find(c => c.startsWith('dark:')) || 'dark:bg-slate-800/50';
    // Create border classes from background - handle both -50 and other shades
    const borderClass = bgClass.replace('bg-', 'border-').replace(/-50$/, '-100').replace(/-100$/, '-200');
    const darkBorderClass = darkBgClass.replace('bg-', 'border-');
    return `${bgClass} ${darkBgClass.replace('/20', '/10')} ${borderClass} ${darkBorderClass}`;
  }

  getIconBgClass(activity: Activity): string {
    const iconData = getIconFromSlug(activity.iconSlug);
    const bgClass = iconData.colorClass.split(' ')[0];
    const darkBgClass = iconData.colorClass.split(' ').find(c => c.startsWith('dark:')) || 'dark:bg-slate-800';
    // Use darker shade for icon background - handle both -50 and other shades
    const darkerBg = bgClass.replace(/-50$/, '-100').replace(/-100$/, '-200');
    return `${darkerBg} ${darkBgClass.replace('/20', '/30')}`;
  }

  getIconColorClass(activity: Activity): string {
    const iconData = getIconFromSlug(activity.iconSlug);
    return iconData.iconColorClass;
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