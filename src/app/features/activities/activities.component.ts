import { Component, signal, computed, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesHeroComponent } from './components/activities-hero.component';
import { ActivitiesFiltersComponent } from './components/activities-filters.component';
import { ActivitiesGridComponent } from './components/activities-grid.component';
import { ActivitiesSidebarComponent } from './components/activities-sidebar.component';
import { ActivitiesService } from './data/activities.service';
import { Activity } from './models/activity.model';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, ActivitiesHeroComponent, ActivitiesFiltersComponent, ActivitiesGridComponent, ActivitiesSidebarComponent],
  templateUrl: './activities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesComponent implements OnInit {
  private readonly activitiesService = inject(ActivitiesService);

  readonly activeFilter = signal<string>('alle');
  readonly filters = this.activitiesService.filters;
  readonly activities = this.activitiesService.activities;

  readonly filteredActivities = computed(() => {
    const filterId = this.activeFilter();
    const allActivities = this.activities();
    
    // If "alle" is selected, show all activities
    if (filterId === 'alle' || !filterId) {
      return allActivities;
    }
    
    // Filter by activity_type_id (UUID comparison)
    return allActivities.filter(a => a.activityTypeId === filterId);
  });

  ngOnInit(): void {
    this.activitiesService.init();
  }

  onFilterChange(filterId: string) {
    this.activeFilter.set(filterId);
  }
}