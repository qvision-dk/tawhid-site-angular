import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityFilter } from '../models/activity-filter.model';

@Component({
  selector: 'app-activities-filters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Filters -->
    @if(filters && filters.length > 0) {
      <div class="flex flex-wrap gap-3 mb-12">
        @for(filter of filters; track filter.id) {
          <button 
            (click)="onFilterClick(filter)"
            [class]="getFilterButtonClasses(filter)"
          >
            {{filter.label}}
          </button>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesFiltersComponent {
  @Input({ required: true }) filters!: ActivityFilter[];
  @Input({ required: true }) activeFilter!: string;
  @Output() filterChange = new EventEmitter<string>();

  constructor(private cdr: ChangeDetectorRef) {}

  onFilterClick(filter: ActivityFilter) {
    this.filterChange.emit(filter.id);
  }

  getFilterButtonClasses(filter: ActivityFilter) {
    const isActive = this.activeFilter === filter.id;
    const baseClasses = 'px-6 py-2.5 rounded-full text-sm font-bold shadow-sm border transition-all hover:scale-105';
    
    if (isActive) {
      return `${baseClasses} bg-secondary text-white border-transparent dark:bg-white dark:text-slate-900`;
    }
    
    return `${baseClasses} bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700`;
  }
}
