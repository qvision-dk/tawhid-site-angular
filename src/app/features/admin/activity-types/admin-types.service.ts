import { Injectable, signal, inject } from '@angular/core';
import { ActivityTypesRepository } from '../../../core/data/activity-types.repository';
import { ActivityType } from '../../activities/models/activity-type.model';

@Injectable({
  providedIn: 'root'
})
export class AdminTypesService {
  private readonly repository = inject(ActivityTypesRepository);

  readonly types = signal<ActivityType[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  async loadAll(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.repository.getAll();
      this.types.set(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load activity types';
      this.error.set(message);
      console.error('Error loading activity types:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async create(iconSlug: string, label: string, sortOrder?: number): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.repository.create({ icon_slug: iconSlug, label, sort_order: sortOrder });
      await this.loadAll();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create activity type';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async update(id: string, iconSlug?: string, label?: string, sortOrder?: number): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.repository.update({ id, icon_slug: iconSlug, label, sort_order: sortOrder });
      await this.loadAll();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update activity type';
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
      const message = err instanceof Error ? err.message : 'Failed to delete activity type';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }
}
