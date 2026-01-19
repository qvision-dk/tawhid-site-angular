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

  readonly activeFilter = signal<string>('all');
  readonly filters = this.activitiesService.filters;
  readonly activities = this.activitiesService.activities;

  readonly filteredActivities = computed(() => {
    const filter = this.activeFilter();
    const allActivities = this.activities();
    
    if (filter === 'all') return allActivities;
    
    return allActivities.filter(a => a.typeSlug === filter);
  });

  ngOnInit(): void {
    this.activitiesService.init();
  }

  onFilterChange(filter: string) {
    this.activeFilter.set(filter);
  }
}