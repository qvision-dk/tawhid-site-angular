import { Component, signal, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminActivitiesService } from './admin-activities.service';
import { AdminActivitiesFormComponent } from './admin-activities.form';
import { ActivityTypesRepository } from '../../../core/data/activity-types.repository';
import { ActivityAdmin } from '../../activities/models/activity.model';
import { ActivityType } from '../../activities/models/activity-type.model';

@Component({
  selector: 'app-admin-activities',
  standalone: true,
  imports: [CommonModule, AdminActivitiesFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-activities.page.html'
})
export class AdminActivitiesPage implements OnInit {
  readonly service = inject(AdminActivitiesService);
  private readonly typesRepository = inject(ActivityTypesRepository);

  readonly showCreateForm = signal(false);
  readonly editingActivity = signal<ActivityAdmin | null>(null);
  readonly activityTypes = signal<ActivityType[]>([]);
  readonly showDeleteConfirm = signal<boolean>(false);
  readonly deleting = signal<boolean>(false);
  readonly activityToDelete = signal<{ id: string; title: string } | null>(null);

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

  startEdit(activity: ActivityAdmin): void {
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

  openDeleteConfirm(id: string, title: string): void {
    this.activityToDelete.set({ id, title });
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm.set(false);
    this.activityToDelete.set(null);
  }

  async confirmDelete(): Promise<void> {
    const activity = this.activityToDelete();
    if (!activity) return;

    this.deleting.set(true);
    try {
      await this.service.delete(activity.id);
      this.closeDeleteConfirm();
    } catch (error) {
      // Error is handled by service
      console.error('Error deleting activity:', error);
    } finally {
      this.deleting.set(false);
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

  getActivityTypeLabel(activityTypeId: string): string {
    const type = this.activityTypes().find(t => t.id === activityTypeId);
    return type?.label || 'Ukendt type';
  }
}
