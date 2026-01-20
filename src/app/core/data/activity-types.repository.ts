import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { ActivityType } from '../../features/activities/models/activity-type.model';

export interface CreateActivityTypeDto {
  slug: string;
  label: string;
  sort_order?: number;
}

export interface UpdateActivityTypeDto {
  slug: string;
  label?: string;
  sort_order?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityTypesRepository {
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

  async getAll(): Promise<ActivityType[]> {
    const { data, error } = await this.supabase
      .from('activity_types')
      .select('id, slug, label, sort_order')
      .order('sort_order', { ascending: true, nullsFirst: false });

    if (error) {
      throw new Error(`Failed to load activity types: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      slug: item.slug,
      label: item.label,
      sortOrder: item.sort_order
    }));
  }

  async getBySlug(slug: string): Promise<ActivityType | null> {
    const { data, error } = await this.supabase
      .from('activity_types')
      .select('id, slug, label, sort_order')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to load activity type: ${error.message}`);
    }

    return {
      id: data.id,
      slug: data.slug,
      label: data.label,
      sortOrder: data.sort_order
    };
  }

  async create(dto: CreateActivityTypeDto): Promise<ActivityType> {
    const { data, error } = await this.supabase
      .from('activity_types')
      .insert(dto)
      .select('id, slug, label, sort_order')
      .single();

    if (error) {
      throw new Error(`Failed to create activity type: ${error.message}`);
    }

    return {
      id: data.id,
      slug: data.slug,
      label: data.label,
      sortOrder: data.sort_order
    };
  }

  async update(dto: UpdateActivityTypeDto): Promise<ActivityType> {
    const { slug, ...updateData } = dto;
    
    const { data, error } = await this.supabase
      .from('activity_types')
      .update(updateData)
      .eq('slug', slug)
      .select('id, slug, label, sort_order')
      .single();

    if (error) {
      throw new Error(`Failed to update activity type: ${error.message}`);
    }

    return {
      id: data.id,
      slug: data.slug,
      label: data.label,
      sortOrder: data.sort_order
    };
  }

  async delete(slug: string): Promise<void> {
    const { error } = await this.supabase
      .from('activity_types')
      .delete()
      .eq('slug', slug);

    if (error) {
      throw new Error(`Failed to delete activity type: ${error.message}`);
    }
  }
}
