import { Component, Input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../models/activity.model';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCardComponent {
  @Input({ required: true }) activity!: Activity;

  readonly icon = computed(() => this.getIconForType(this.activity?.typeSlug || ''));
  readonly colorClass = computed(() => this.getColorClassForType(this.activity?.typeSlug || ''));
  readonly iconColorClass = computed(() => this.getIconColorClassForType(this.activity?.typeSlug || ''));
  readonly day = computed(() => this.formatDay());
  readonly time = computed(() => this.formatTime());
  readonly repeatBadgeText = computed(() => this.getRepeatBadgeText());

  private getIconForType(typeSlug: string): string {
    if (!typeSlug) return 'event';
    const iconMap: Record<string, string> = {
      'prayer': 'mosque',
      'teaching': 'menu_book',
      'youth': 'groups',
      'community': 'favorite'
    };
    return iconMap[typeSlug.toLowerCase()] || 'event';
  }

  private getColorClassForType(typeSlug: string): string {
    if (!typeSlug) return 'bg-slate-50 dark:bg-slate-900/20 text-slate-600';
    const colorMap: Record<string, string> = {
      'prayer': 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
      'teaching': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
      'youth': 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
      'community': 'bg-pink-50 dark:bg-pink-900/20 text-pink-600'
    };
    return colorMap[typeSlug.toLowerCase()] || 'bg-slate-50 dark:bg-slate-900/20 text-slate-600';
  }

  private getIconColorClassForType(typeSlug: string): string {
    if (!typeSlug) return 'text-slate-500';
    const colorMap: Record<string, string> = {
      'prayer': 'text-amber-500',
      'teaching': 'text-blue-500',
      'youth': 'text-emerald-500',
      'community': 'text-pink-500'
    };
    return colorMap[typeSlug.toLowerCase()] || 'text-slate-500';
  }

  private formatDay(): string {
    if (this.activity.repeatBadge === 'weekly' && this.activity.weekday !== undefined) {
      const weekdays = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
      return weekdays[this.activity.weekday] || '';
    }
    if (this.activity.date) {
      const date = new Date(this.activity.date);
      return date.toLocaleDateString('da-DK', { weekday: 'long', day: 'numeric', month: 'long' });
    }
    return '';
  }

  private formatTime(): string {
    if (this.activity.startTime && this.activity.endTime) {
      // Format from HH:MM:SS to HH:MM
      const start = this.activity.startTime.substring(0, 5);
      const end = this.activity.endTime.substring(0, 5);
      return `${start} - ${end}`;
    }
    if (this.activity.startTime) {
      return this.activity.startTime.substring(0, 5);
    }
    return '';
  }

  private getRepeatBadgeText(): string {
    if (this.activity.repeatBadge === 'weekly') return 'Ugentlig';
    if (this.activity.repeatBadge === 'monthly') return 'Månedlig';
    if (this.activity.repeatBadge === 'yearly') return 'Årlig';
    return '';
  }
}
