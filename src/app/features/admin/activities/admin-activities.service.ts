import { Injectable, signal, inject } from '@angular/core';
import { ActivitiesRepository } from '../../../core/data/activities.repository';
import { ActivityAdmin } from '../../activities/models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class AdminActivitiesService {
  private readonly repository = inject(ActivitiesRepository);

  readonly activities = signal<ActivityAdmin[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  async loadAll(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.repository.getAll();
      this.activities.set(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load activities';
      this.error.set(message);
      console.error('Error loading activities:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async getById(id: string): Promise<ActivityAdmin | null> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const activity = await this.repository.getById(id);
      return activity;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load activity';
      this.error.set(message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async create(dto: {
    title: string;
    description?: string | null;
    activity_type_id: string;
    date?: string | null;
    weekday?: number | null;
    start_time?: string | null;
    end_time?: string | null;
    location?: string | null;
    repeat_badge?: 'weekly' | 'monthly' | 'yearly' | null;
    is_active?: boolean;
  }): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.repository.create(dto);
      await this.loadAll();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create activity';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async update(id: string, dto: {
    title?: string;
    description?: string | null;
    activity_type_id?: string;
    date?: string | null;
    weekday?: number | null;
    start_time?: string | null;
    end_time?: string | null;
    location?: string | null;
    repeat_badge?: 'weekly' | 'monthly' | 'yearly' | null;
    is_active?: boolean;
  }): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.repository.update({ id, ...dto });
      await this.loadAll();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update activity';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async delete(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.repository.delete(id);
      await this.loadAll();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete activity';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }
}
