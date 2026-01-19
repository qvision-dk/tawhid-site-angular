import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCardComponent } from './activity-card.component';
import { Activity } from '../models/activity.model';

@Component({
  selector: 'app-activities-grid',
  standalone: true,
  imports: [CommonModule, ActivityCardComponent],
  template: `
    <!-- Activity Cards -->
    <div class="flex flex-col space-y-6">
      @for(activity of activities; track activity.id) {
        <app-activity-card [activity]="activity"></app-activity-card>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesGridComponent {
  @Input({ required: true }) activities!: Activity[];
}
