import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Activity } from '../../features/activities/models/activity.model';

export interface CreateActivityDto {
  title: string;
  description?: string | null;
  activity_type_id: string; // FK to activity_types.id
  date?: string | null;
  weekday?: number | null;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  repeat_badge?: 'weekly' | 'monthly' | 'yearly' | null;
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
    // Include null values to allow clearing fields
    const filteredUpdateData: Partial<CreateActivityDto> = {};
    if (updateData.title !== undefined && updateData.title !== null) filteredUpdateData.title = updateData.title.trim();
    // Handle description: include null to allow clearing the field
    if (updateData.description !== undefined) {
      filteredUpdateData.description = (updateData.description && updateData.description.trim()) ? updateData.description.trim() : null;
    }
    if (updateData.activity_type_id !== undefined && updateData.activity_type_id !== null) filteredUpdateData.activity_type_id = updateData.activity_type_id;
    // Handle date: include null to allow clearing the field
    if (updateData.date !== undefined) {
      filteredUpdateData.date = (updateData.date && updateData.date !== '') ? updateData.date : null;
    }
    // Handle weekday: include null to allow clearing the field
    if (updateData.weekday !== undefined) {
      filteredUpdateData.weekday = (updateData.weekday !== null) ? updateData.weekday : null;
    }
    // Handle start_time: include null to allow clearing the field
    if (updateData.start_time !== undefined) {
      filteredUpdateData.start_time = (updateData.start_time && updateData.start_time !== '') ? updateData.start_time : null;
    }
    // Handle end_time: include null to allow clearing the field
    if (updateData.end_time !== undefined) {
      filteredUpdateData.end_time = (updateData.end_time && updateData.end_time !== '') ? updateData.end_time : null;
    }
    // Handle location: include null to allow clearing the field
    if (updateData.location !== undefined) {
      filteredUpdateData.location = (updateData.location && updateData.location.trim()) ? updateData.location.trim() : null;
    }
    // Handle repeat_badge: include null to allow clearing the field
    if (updateData.repeat_badge !== undefined) filteredUpdateData.repeat_badge = updateData.repeat_badge || null;
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
