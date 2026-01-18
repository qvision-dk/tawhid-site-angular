import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesHeroComponent } from './components/activities-hero.component';
import { ActivitiesFiltersComponent } from './components/activities-filters.component';
import { ActivitiesGridComponent } from './components/activities-grid.component';
import { ActivitiesSidebarComponent } from './components/activities-sidebar.component';

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
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, ActivitiesHeroComponent, ActivitiesFiltersComponent, ActivitiesGridComponent, ActivitiesSidebarComponent],
  templateUrl: './activities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesComponent {
  readonly activeFilter = signal<string>('Alle');
  readonly filters = ['Alle', 'Bøn', 'Undervisning', 'Ungdom', 'Fællesskab'];

  readonly activities = signal<Activity[]>([
    {
      title: 'Fredagssammenkomst',
      category: 'Bøn',
      description: 'Hver uge samles vi til vores fredagssammenkomst, hvor vi dyrker fællesskab, refleksion og samhørighed. Det er et af ugens højdepunkter.',
      icon: 'calendar_today',
      day: 'Hver fredag',
      time: '13:00 - 14:30',
      colorClass: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
      iconColorClass: 'text-amber-500'
    },
    {
      title: 'Ungdomsaktiviteter',
      category: 'Ungdom',
      description: 'Et bredt udvalg af ungdomsaktiviteter, der giver plads til udvikling, fællesskab og gode oplevelser i et positivt miljø for alle.',
      icon: 'groups',
      day: 'Lørdag',
      time: '15:00 - 18:00',
      colorClass: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
      iconColorClass: 'text-emerald-500'
    },
    {
      title: 'Koranundervisning',
      category: 'Undervisning',
      description: 'Undervisning i Koranen for alle aldersgrupper. Vores læringsmiljø er åbent, respektfuldt og tilpasset alle niveauer.',
      icon: 'menu_book',
      day: 'Søndag',
      time: '10:00 - 12:00',
      colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
      iconColorClass: 'text-blue-500'
    }
  ]);

  readonly filteredActivities = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'Alle') return this.activities();
    return this.activities().filter(a => a.category === filter);
  });

  onFilterChange(filter: string) {
    this.activeFilter.set(filter);
  }
}