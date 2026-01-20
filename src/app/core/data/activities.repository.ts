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
    // Validate required fields
    if (!dto.title || !dto.title.trim()) {
      throw new Error('Title is required');
    }
    if (!dto.activity_type_id) {
      throw new Error('Activity type is required');
    }
    
    // Filter to only include valid fields - build object explicitly
    const filteredDto: CreateActivityDto = {
      title: dto.title.trim(),
      activity_type_id: dto.activity_type_id,
      ...(dto.description !== undefined && dto.description !== null && dto.description.trim() && { description: dto.description.trim() }),
      ...(dto.date !== undefined && dto.date !== null && dto.date !== '' && { date: dto.date }),
      ...(dto.weekday !== undefined && dto.weekday !== null && { weekday: dto.weekday }),
      ...(dto.start_time !== undefined && dto.start_time !== null && dto.start_time !== '' && { start_time: dto.start_time }),
      ...(dto.end_time !== undefined && dto.end_time !== null && dto.end_time !== '' && { end_time: dto.end_time }),
      ...(dto.location !== undefined && dto.location !== null && dto.location.trim() && { location: dto.location.trim() }),
      ...(dto.repeat_badge !== undefined && dto.repeat_badge !== null && { repeat_badge: dto.repeat_badge }),
      ...(dto.is_active !== undefined && { is_active: dto.is_active })
    };
    
    const { data, error } = await this.supabase
      .from('activities')
      .insert(filteredDto)
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
    
    // Validate title if provided
    if (updateData.title !== undefined && (!updateData.title || !updateData.title.trim())) {
      throw new Error('Title cannot be empty');
    }
    
    // Filter to only include valid fields - build object explicitly
    const filteredUpdateData: Partial<CreateActivityDto> = {};
    if (updateData.title !== undefined && updateData.title !== null) filteredUpdateData.title = updateData.title.trim();
    if (updateData.description !== undefined && updateData.description !== null && updateData.description.trim()) filteredUpdateData.description = updateData.description.trim();
    if (updateData.activity_type_id !== undefined && updateData.activity_type_id !== null) filteredUpdateData.activity_type_id = updateData.activity_type_id;
    if (updateData.date !== undefined && updateData.date !== null && updateData.date !== '') filteredUpdateData.date = updateData.date;
    if (updateData.weekday !== undefined && updateData.weekday !== null) filteredUpdateData.weekday = updateData.weekday;
    if (updateData.start_time !== undefined && updateData.start_time !== null && updateData.start_time !== '') filteredUpdateData.start_time = updateData.start_time;
    if (updateData.end_time !== undefined && updateData.end_time !== null && updateData.end_time !== '') filteredUpdateData.end_time = updateData.end_time;
    if (updateData.location !== undefined && updateData.location !== null && updateData.location.trim()) filteredUpdateData.location = updateData.location.trim();
    if (updateData.repeat_badge !== undefined && updateData.repeat_badge !== null) filteredUpdateData.repeat_badge = updateData.repeat_badge;
    if (updateData.is_active !== undefined) filteredUpdateData.is_active = updateData.is_active;
    
    const { data, error } = await this.supabase
      .from('activities')
      .update(filteredUpdateData)
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
