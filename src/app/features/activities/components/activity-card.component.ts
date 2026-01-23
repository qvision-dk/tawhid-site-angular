import { Component, Input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../models/activity.model';
import { getIconFromSlug } from '../models/activity-icon.model';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCardComponent {
  @Input({ required: true }) activity!: Activity;

  readonly iconData = computed(() => getIconFromSlug(this.activity?.iconSlug));
  readonly icon = computed(() => this.iconData().materialIcon);
  readonly colorClass = computed(() => this.iconData().colorClass);
  readonly iconColorClass = computed(() => this.iconData().iconColorClass);
  readonly day = computed(() => this.formatDay());
  readonly time = computed(() => this.formatTime());
  readonly repeatBadgeText = computed(() => this.getRepeatBadgeText());

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
