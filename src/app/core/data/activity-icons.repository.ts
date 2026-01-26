import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { ActivityIcon } from '../../features/activities/models/activity-icon.model';

// Database table structure: id, icon_slug, label, created_at
interface DbActivityIcon {
  id: string;
  icon_slug: string;
  label: string;
  created_at?: string;
}

export interface CreateActivityIconDto {
  icon_slug: string;
  label: string;
}

export interface UpdateActivityIconDto {
  id: string;
  icon_slug?: string;
  label?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityIconsRepository {
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

  private mapToActivityIcon(item: DbActivityIcon): ActivityIcon {
    return {
      id: item.id,
      slug: item.icon_slug,
      material_icon: item.icon_slug,
      color_class: '',
      icon_color_class: ''
    };
  }

  async getAll(): Promise<ActivityIcon[]> {
    const { data, error } = await this.supabase
      .from('activity_icons')
      .select('id, icon_slug, label, created_at')
      .order('label', { ascending: true });

    if (error) {
      throw new Error(`Failed to load activity icons: ${error.message}`);
    }

    return (data || []).map((item: DbActivityIcon) => this.mapToActivityIcon(item));
  }

  async getBySlug(slug: string): Promise<ActivityIcon | null> {
    // Try to find by icon_slug first
    const { data: dataByIconSlug, error: errorByIconSlug } = await this.supabase
      .from('activity_icons')
      .select('id, icon_slug, label, created_at')
      .eq('icon_slug', slug)
      .maybeSingle();
    
    if (!errorByIconSlug && dataByIconSlug) {
      return this.mapToActivityIcon(dataByIconSlug);
    }

    // Fallback to id
    const { data, error } = await this.supabase
      .from('activity_icons')
      .select('id, icon_slug, label, created_at')
      .eq('id', slug)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to load activity icon: ${error.message}`);
    }

    if (!data) return null;

    return this.mapToActivityIcon(data);
  }

  async create(dto: CreateActivityIconDto): Promise<ActivityIcon> {
    const { data, error } = await this.supabase
      .from('activity_icons')
      .insert({
        icon_slug: dto.icon_slug,
        label: dto.label
      })
      .select('id, icon_slug, label, created_at')
      .single();

    if (error) {
      throw new Error(`Failed to create activity icon: ${error.message}`);
    }

    return this.mapToActivityIcon(data);
  }

  async update(dto: UpdateActivityIconDto): Promise<ActivityIcon> {
    const { id, ...updateData } = dto;
    
    // Build update object without undefined values
    const updateObj: Record<string, unknown> = {};
    if (updateData.icon_slug !== undefined) updateObj.icon_slug = updateData.icon_slug;
    if (updateData.label !== undefined) updateObj.label = updateData.label;

    const { data, error } = await this.supabase
      .from('activity_icons')
      .update(updateObj)
      .eq('id', id)
      .select('id, icon_slug, label, created_at')
      .single();

    if (error) {
      throw new Error(`Failed to update activity icon: ${error.message}`);
    }

    return this.mapToActivityIcon(data);
  }

  async delete(id: string): Promise<void> {
    // Try to delete by id first
    const { error: errorById } = await this.supabase
      .from('activity_icons')
      .delete()
      .eq('id', id);

    if (!errorById) return;

    // Fallback to icon_slug
    const { error } = await this.supabase
      .from('activity_icons')
      .delete()
      .eq('icon_slug', id);

    if (error) {
      throw new Error(`Failed to delete activity icon: ${error.message}`);
    }
  }
}
