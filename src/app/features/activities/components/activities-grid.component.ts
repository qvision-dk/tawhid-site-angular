import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCardComponent } from './activity-card.component';

interface Activity {
  title: string;
  category: string;
  description: string;
  icon: string;
  day: string;
  time: string;
  colorClass: string;
  iconColorClass: string;
}

@Component({
  selector: 'app-activities-grid',
  standalone: true,
  imports: [CommonModule, ActivityCardComponent],
  template: `
    <!-- Activity Cards -->
    <div class="space-y-6">
      @for(activity of activities; track activity.title) {
        <app-activity-card [activity]="activity"></app-activity-card>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesGridComponent {
  @Input({ required: true }) activities!: Activity[];
}
