import { Injectable, signal, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { Activity } from '../models/activity.model';
import { ActivityFilter } from '../models/activity-filter.model';
import { ActivityIconsService } from './activity-icons.service';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private supabase: SupabaseClient;
  private readonly iconsService = inject(ActivityIconsService);
  
  readonly activities = signal<Activity[]>([]);
  readonly filters = signal<ActivityFilter[]>([]);
  readonly loading = signal<boolean>(false);

  constructor() {
    if (!environment.supabaseUrl || !environment.supabaseAnonKey) {
      throw new Error('Supabase environment variables are not configured. Please set supabaseUrl and supabaseAnonKey in environment.ts');
    }
    
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  async init(): Promise<void> {
    // Skip if already loaded
    if (this.activities().length > 0 && this.filters().length > 0) {
      return;
    }
    
    this.loading.set(true);
    try {
      // Initialize icons service first so icons are available when activities load
      await this.iconsService.init();
      // Load filters first so activityTypes is available for loadActivities
      await this.loadFilters();
      await this.loadActivities();
    } finally {
      this.loading.set(false);
    }
  }

  private async loadActivities(): Promise<void> {
    const { data, error } = await this.supabase
      .from('activities_public_view')
      .select('*')
      .order('date', { ascending: true, nullsFirst: false })
      .order('weekday', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('Error loading activities:', error);
      return;
    }

    // Map Supabase snake_case to camelCase
    const mappedActivities: Activity[] = (data || []).map((item: {
      id: string;
      title: string;
      description?: string | null;
      activity_type_id: string;
      activity_type_label: string;
      icon_slug?: string | null;
      repeat_badge?: 'weekly' | 'monthly' | 'yearly' | null;
      date?: string | null;
      weekday?: number | null;
      start_time?: string | null;
      end_time?: string | null;
      location?: string | null;
    }) => {
      const activity = {
        id: item.id,
        title: item.title,
        description: item.description,
        activityTypeId: item.activity_type_id,
        activityTypeLabel: item.activity_type_label,
        iconSlug: item.icon_slug || undefined,
        repeatBadge: item.repeat_badge,
        date: item.date,
        weekday: item.weekday,
        startTime: item.start_time,
        endTime: item.end_time,
        location: item.location
      };
      return activity;
    });

    this.activities.set(mappedActivities);
  }

  private async loadFilters(): Promise<void> {
    // Always ensure "Alle" filter is available
    const filterList: ActivityFilter[] = [
      { id: 'alle', label: 'Alle' }
    ];

    // Load activity types from activity_types table
    const { data, error } = await this.supabase
      .from('activity_types')
      .select('id, label')
      .order('sort_order', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('Error loading activity types:', error);
      this.filters.set(filterList);
      return;
    }

    if (!data || data.length === 0) {
      this.filters.set(filterList);
      return;
    }

    // Add activity type filters - use id for filtering, label for display
    const mappedFilters = data.map((item: {
      id: string;
      label: string;
    }) => ({
      id: item.id,
      label: item.label
    }));

    filterList.push(...mappedFilters);
    this.filters.set(filterList);
  }
}
