import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { Activity } from '../models/activity.model';
import { ActivityFilter } from '../models/activity-filter.model';
import { ActivityType } from '../models/activity-type.model';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private supabase: SupabaseClient;
  
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
    this.loading.set(true);
    try {
      await Promise.all([
        this.loadActivities(),
        this.loadFilters()
      ]);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadActivities(): Promise<void> {
    const { data, error } = await this.supabase
      .from('public_activities')
      .select('*')
      .order('date', { ascending: true, nullsFirst: false })
      .order('weekday', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('Error loading activities:', error);
      return;
    }

    // Map Supabase snake_case to camelCase
    const mappedActivities: Activity[] = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      typeSlug: item.type_slug || item.typeSlug || '',
      typeLabel: item.type_label || item.typeLabel || '',
      repeatBadge: item.repeat_badge || item.repeatBadge,
      date: item.date,
      weekday: item.weekday,
      startTime: item.start_time || item.startTime,
      endTime: item.end_time || item.endTime,
      location: item.location
    }));

    this.activities.set(mappedActivities);
  }

  private async loadFilters(): Promise<void> {
    const { data, error } = await this.supabase
      .from('activity_types')
      .select('slug, label, sort_order')
      .order('sort_order', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('Error loading activity types:', error);
      return;
    }

    const types = (data || []) as ActivityType[];
    const filterList: ActivityFilter[] = [
      { slug: 'all', label: 'Alle' },
      ...types.map(type => ({ slug: type.slug, label: type.label }))
    ];

    this.filters.set(filterList);
  }
}
