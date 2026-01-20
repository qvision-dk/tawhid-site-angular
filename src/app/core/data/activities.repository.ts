import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Activity } from '../../features/activities/models/activity.model';

export interface CreateActivityDto {
  title: string;
  description?: string;
  activity_type_id: string; // FK to activity_types.id
  date?: string;
  weekday?: number;
  start_time?: string;
  end_time?: string;
  location?: string;
  repeat_badge?: 'weekly' | 'monthly' | 'yearly';
  is_active?: boolean;
}

export interface UpdateActivityDto extends Partial<CreateActivityDto> {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivitiesRepository {
  private readonly platformId = inject(PLATFORM_ID);
  private supabase: SupabaseClient;

  constructor() {
    if (!environment.supabaseUrl || !environment.supabaseAnonKey) {
      throw new Error('Supabase environment variables are not configured.');
    }
    
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    }
  }

  async getAll(): Promise<Activity[]> {
    const { data, error } = await this.supabase
      .from('activities')
      .select('*, activity_types(slug, label)')
      .order('date', { ascending: true, nullsFirst: false })
      .order('weekday', { ascending: true, nullsFirst: false });

    if (error) {
      throw new Error(`Failed to load activities: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      typeSlug: item.type_slug || item.activity_types?.slug || '',
      typeLabel: item.activity_types?.label || '',
      repeatBadge: item.repeat_badge,
      date: item.date,
      weekday: item.weekday,
      startTime: item.start_time,
      endTime: item.end_time,
      location: item.location,
      isActive: item.is_active ?? true
    }));
  }

  async getById(id: string): Promise<Activity | null> {
    const { data, error } = await this.supabase
      .from('activities')
      .select('*, activity_types(slug, label)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to load activity: ${error.message}`);
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      typeSlug: data.type_slug || data.activity_types?.slug || '',
      typeLabel: data.activity_types?.label || '',
      repeatBadge: data.repeat_badge,
      date: data.date,
      weekday: data.weekday,
      startTime: data.start_time,
      endTime: data.end_time,
      location: data.location,
      isActive: data.is_active ?? true
    };
  }

  async create(dto: CreateActivityDto): Promise<Activity> {
    const { data, error } = await this.supabase
      .from('activities')
      .insert(dto)
      .select('*, activity_types(slug, label)')
      .single();

    if (error) {
      throw new Error(`Failed to create activity: ${error.message}`);
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      typeSlug: data.type_slug || data.activity_types?.slug || '',
      typeLabel: data.activity_types?.label || '',
      repeatBadge: data.repeat_badge,
      date: data.date,
      weekday: data.weekday,
      startTime: data.start_time,
      endTime: data.end_time,
      location: data.location,
      isActive: data.is_active ?? true
    };
  }

  async update(dto: UpdateActivityDto): Promise<Activity> {
    const { id, ...updateData } = dto;
    
    const { data, error } = await this.supabase
      .from('activities')
      .update(updateData)
      .eq('id', id)
      .select('*, activity_types(slug, label)')
      .single();

    if (error) {
      throw new Error(`Failed to update activity: ${error.message}`);
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      typeSlug: data.type_slug || data.activity_types?.slug || '',
      typeLabel: data.activity_types?.label || '',
      repeatBadge: data.repeat_badge,
      date: data.date,
      weekday: data.weekday,
      startTime: data.start_time,
      endTime: data.end_time,
      location: data.location,
      isActive: data.is_active ?? true
    };
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete activity: ${error.message}`);
    }
  }
}
