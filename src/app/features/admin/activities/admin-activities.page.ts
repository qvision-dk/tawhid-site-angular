import { Component, signal, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminActivitiesService } from './admin-activities.service';
import { AdminActivitiesFormComponent } from './admin-activities.form';
import { ActivityTypesRepository } from '../../../core/data/activity-types.repository';
import { Activity } from '../../activities/models/activity.model';
import { ActivityType } from '../../activities/models/activity-type.model';

@Component({
  selector: 'app-admin-activities',
  standalone: true,
  imports: [CommonModule, AdminActivitiesFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-display font-bold text-secondary dark:text-white mb-2">Aktiviteter</h2>
          <p class="text-slate-600 dark:text-slate-400">Administrer alle aktiviteter</p>
        </div>
        <button
          (click)="showCreateForm.set(true)"
          class="bg-primary hover:bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
        >
          <span class="material-icons-round text-sm">add</span>
          Ny aktivitet
        </button>
      </div>

      <!-- Error Message -->
      @if(service.error()) {
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p class="text-red-600 dark:text-red-400 text-sm font-medium">{{service.error()}}</p>
        </div>
      }

      <!-- Create/Edit Form -->
      @if(showCreateForm() || editingActivity()) {
        <app-admin-activities-form
          [activity]="editingActivity()"
          [activityTypes]="activityTypes()"
          (submit)="onFormSubmit($event)"
          (cancel)="cancelEdit()"
        ></app-admin-activities-form>
      }

      <!-- Loading State -->
      @if(service.loading()) {
        <div class="text-center py-12">
          <p class="text-slate-600 dark:text-slate-400">Indlæser...</p>
        </div>
      }

      <!-- Activities List -->
      @if(!service.loading() && service.activities().length > 0) {
        <div class="space-y-4">
          @for(activity of service.activities(); track activity.id) {
            <div class="bg-white dark:bg-[#1e293b]/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 class="text-2xl font-display font-bold text-slate-900 dark:text-white">{{activity.title}}</h3>
                    @if(!activity.isActive) {
                      <span class="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-[10px] uppercase font-bold">
                        Inaktiv
                      </span>
                    }
                    @if(activity.repeatBadge) {
                      <span class="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-[10px] uppercase font-bold text-slate-500 dark:text-slate-300">
                        {{getRepeatBadgeText(activity.repeatBadge)}}
                      </span>
                    }
                  </div>
                  
                  @if(activity.description) {
                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {{activity.description}}
                    </p>
                  }

                  <div class="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span><strong>Type:</strong> {{activity.typeLabel}}</span>
                    @if(activity.date) {
                      <span><strong>Dato:</strong> {{formatDate(activity.date)}}</span>
                    }
                    @if(activity.weekday !== undefined) {
                      <span><strong>Ugedag:</strong> {{getWeekdayName(activity.weekday)}}</span>
                    }
                    @if(activity.startTime) {
                      <span><strong>Tid:</strong> {{formatTime(activity.startTime)}}@if(activity.endTime) { - {{formatTime(activity.endTime)}}}</span>
                    }
                    @if(activity.location) {
                      <span><strong>Lokation:</strong> {{activity.location}}</span>
                    }
                  </div>
                </div>

                <div class="flex gap-2 shrink-0">
                  <button
                    (click)="startEdit(activity)"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Rediger
                  </button>
                  <button
                    (click)="confirmDelete(activity.id, activity.title)"
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Slet
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Empty State -->
      @if(!service.loading() && service.activities().length === 0) {
        <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-12 border border-slate-100 dark:border-slate-800 text-center">
          <p class="text-slate-600 dark:text-slate-400">Ingen aktiviteter endnu</p>
        </div>
      }
    </div>
  `
})
export class AdminActivitiesPage implements OnInit {
  readonly service = inject(AdminActivitiesService);
  private readonly typesRepository = inject(ActivityTypesRepository);

  readonly showCreateForm = signal(false);
  readonly editingActivity = signal<Activity | null>(null);
  readonly activityTypes = signal<ActivityType[]>([]);

  ngOnInit(): void {
    this.service.loadAll();
    this.loadActivityTypes();
  }

  private async loadActivityTypes(): Promise<void> {
    try {
      const types = await this.typesRepository.getAll();
      this.activityTypes.set(types);
    } catch (error) {
      console.error('Error loading activity types:', error);
    }
  }

  startEdit(activity: Activity): void {
    this.editingActivity.set(activity);
    this.showCreateForm.set(false);
  }

  cancelEdit(): void {
    this.showCreateForm.set(false);
    this.editingActivity.set(null);
  }

  async onFormSubmit(payload: any): Promise<void> {
    try {
      if (payload.id) {
        const { id, ...updateData } = payload;
        await this.service.update(id, updateData);
      } else {
        await this.service.create(payload);
      }
      this.cancelEdit();
    } catch (error) {
      // Error is handled by service
    }
  }

  async confirmDelete(id: string, title: string): Promise<void> {
    if (confirm(`Er du sikker på, at du vil slette aktiviteten "${title}"?`)) {
      try {
        await this.service.delete(id);
      } catch (error) {
        // Error is handled by service
      }
    }
  }

  getRepeatBadgeText(badge: string): string {
    switch (badge) {
      case 'weekly': return 'Ugentlig';
      case 'monthly': return 'Månedlig';
      case 'yearly': return 'Årlig';
      default: return badge;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('da-DK');
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getWeekdayName(weekday: number): string {
    const weekdays = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
    return weekdays[weekday] || '';
  }
}
