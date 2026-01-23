import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { ActivityIcon } from '../../features/activities/models/activity-icon.model';

export interface CreateActivityIconDto {
  slug: string;
  material_icon: string;
  color_class: string;
  icon_color_class: string;
}

export interface UpdateActivityIconDto {
  slug: string;
  material_icon?: string;
  color_class?: string;
  icon_color_class?: string;
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

  async getAll(): Promise<ActivityIcon[]> {
    const { data, error } = await this.supabase
      .from('activity_icons')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`Failed to load activity icons: ${error.message}`);
    }

    // Map database columns to ActivityIcon model
    // icon_slug IS the Material icon name (treat as data, render directly)
    return (data || []).map((item: {
      id: string;
      icon_slug: string;
      label?: string;
    }) => ({
      id: item.id,
      slug: item.icon_slug, // Use icon_slug as slug
      material_icon: item.icon_slug, // icon_slug IS the Material icon name
      color_class: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600', // Default colors
      icon_color_class: 'text-slate-500' // Default icon color
    }));
  }

  async getBySlug(slug: string): Promise<ActivityIcon | null> {
    // Query by icon_slug (the actual column name in the database)
    const { data, error } = await this.supabase
      .from('activity_icons')
      .select('*')
      .eq('icon_slug', slug)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to load activity icon: ${error.message}`);
    }

    if (!data) return null;

    // Map to ActivityIcon - icon_slug IS the Material icon name
    return {
      id: data.id,
      slug: data.icon_slug,
      material_icon: data.icon_slug, // icon_slug IS the Material icon name
      color_class: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
      icon_color_class: 'text-slate-500'
    };
  }

  async create(dto: CreateActivityIconDto): Promise<ActivityIcon> {
    // Only insert icon_slug (the actual column name)
    // icon_slug IS the Material icon name
    const { data, error } = await this.supabase
      .from('activity_icons')
      .insert({ icon_slug: dto.slug })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create activity icon: ${error.message}`);
    }

    return {
      id: data.id,
      slug: data.icon_slug,
      material_icon: data.icon_slug, // icon_slug IS the Material icon name
      color_class: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
      icon_color_class: 'text-slate-500'
    };
  }

  async update(dto: UpdateActivityIconDto): Promise<ActivityIcon> {
    const { slug, ...updateData } = dto;
    
    // Build update object - only update icon_slug if material_icon is provided
    const updateObj: Record<string, unknown> = {};
    if (updateData.material_icon !== undefined) {
      updateObj.icon_slug = updateData.material_icon; // icon_slug IS the Material icon name
    }
    
    // Update by icon_slug (the actual column name)
    const { data, error } = await this.supabase
      .from('activity_icons')
      .update(updateObj)
      .eq('icon_slug', slug)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update activity icon: ${error.message}`);
    }

    if (!data) {
      throw new Error('Activity icon not found');
    }

    return {
      id: data.id,
      slug: data.icon_slug,
      material_icon: data.icon_slug, // icon_slug IS the Material icon name
      color_class: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
      icon_color_class: 'text-slate-500'
    };
  }

  async delete(slug: string): Promise<void> {
    // Delete by icon_slug (the actual column name)
    const { error: errorByIconSlug } = await this.supabase
      .from('activity_icons')
      .delete()
      .eq('icon_slug', slug);

    if (!errorByIconSlug) return;

    // Fallback to id if icon_slug doesn't match
    const { error } = await this.supabase
      .from('activity_icons')
      .delete()
      .eq('id', slug);

    if (error) {
      throw new Error(`Failed to delete activity icon: ${error.message}`);
    }
  }
}
