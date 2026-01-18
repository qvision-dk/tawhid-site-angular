import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activities-filters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-12">
      @for(filter of filters; track filter) {
        <button 
          (click)="onFilterClick(filter)"
          [class]="getFilterButtonClasses(filter)"
        >
          {{filter}}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesFiltersComponent {
  @Input({ required: true }) filters!: string[];
  @Input({ required: true }) activeFilter!: string;
  @Output() filterChange = new EventEmitter<string>();

  onFilterClick(filter: string) {
    this.filterChange.emit(filter);
  }

  getFilterButtonClasses(filter: string) {
    const isActive = this.activeFilter === filter;
    const baseClasses = 'px-6 py-2.5 rounded-full text-sm font-bold shadow-sm border transition-all hover:scale-105';
    
    if (isActive) {
      return `${baseClasses} bg-secondary text-white border-transparent dark:bg-white dark:text-slate-900`;
    }
    
    return `${baseClasses} bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700`;
  }
}
