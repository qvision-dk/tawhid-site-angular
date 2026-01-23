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

    return (data || []).map((item: {
      id: string;
      slug?: string;
      icon_slug?: string;
      material_icon?: string;
      material_icon_name?: string;
      color_class?: string;
      icon_color_class?: string;
    }) => ({
      id: item.id,
      slug: item.slug || item.icon_slug || item.id,
      material_icon: item.material_icon || item.material_icon_name || 'event',
      color_class: item.color_class || 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
      icon_color_class: item.icon_color_class || 'text-slate-500'
    }));
  }

  async getBySlug(slug: string): Promise<ActivityIcon | null> {
    // Try to find by slug column first, then fallback to icon_slug or id
    const { data: dataBySlug, error: errorBySlug } = await this.supabase
      .from('activity_icons')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (!errorBySlug && dataBySlug) {
      return {
        id: dataBySlug.id,
        slug: dataBySlug.slug || dataBySlug.icon_slug || dataBySlug.id,
        material_icon: dataBySlug.material_icon || dataBySlug.material_icon_name || 'event',
        color_class: dataBySlug.color_class || 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
        icon_color_class: dataBySlug.icon_color_class || 'text-slate-500'
      };
    }

    const { data: dataByIconSlug, error: errorByIconSlug } = await this.supabase
      .from('activity_icons')
      .select('*')
      .eq('icon_slug', slug)
      .maybeSingle();
    
    if (!errorByIconSlug && dataByIconSlug) {
      return {
        id: dataByIconSlug.id,
        slug: dataByIconSlug.slug || dataByIconSlug.icon_slug || dataByIconSlug.id,
        material_icon: dataByIconSlug.material_icon || dataByIconSlug.material_icon_name || 'event',
        color_class: dataByIconSlug.color_class || 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
        icon_color_class: dataByIconSlug.icon_color_class || 'text-slate-500'
      };
    }

    // Fallback to id
    const { data, error } = await this.supabase
      .from('activity_icons')
      .select('*')
      .eq('id', slug)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to load activity icon: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      slug: data.slug || data.icon_slug || data.id,
      material_icon: data.material_icon || data.material_icon_name || 'event',
      color_class: data.color_class || 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
      icon_color_class: data.icon_color_class || 'text-slate-500'
    };
  }

  async create(dto: CreateActivityIconDto): Promise<ActivityIcon> {
    // Try to include slug, but handle if column doesn't exist
    const insertData: Record<string, unknown> = {
      material_icon: dto.material_icon,
      color_class: dto.color_class,
      icon_color_class: dto.icon_color_class
    };

    // Try with slug first
    try {
      const { data, error } = await this.supabase
        .from('activity_icons')
        .insert({ ...insertData, slug: dto.slug })
        .select('*')
        .single();

      if (error) {
        // If error is about missing slug column, try with icon_slug or without
        if (error.message.includes('slug') || error.message.includes('column')) {
          const { data: dataWithoutSlug, error: errorWithoutSlug } = await this.supabase
            .from('activity_icons')
            .insert({ ...insertData, icon_slug: dto.slug })
            .select('*')
            .single();

          if (errorWithoutSlug) {
            throw new Error(`Failed to create activity icon: ${errorWithoutSlug.message}`);
          }

          return {
            id: dataWithoutSlug.id,
            slug: dataWithoutSlug.slug || dataWithoutSlug.icon_slug || dataWithoutSlug.id,
            material_icon: dataWithoutSlug.material_icon || dataWithoutSlug.material_icon_name || 'event',
            color_class: dataWithoutSlug.color_class || 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
            icon_color_class: dataWithoutSlug.icon_color_class || 'text-slate-500'
          };
        }
        throw new Error(`Failed to create activity icon: ${error.message}`);
      }

      return {
        id: data.id,
        slug: data.slug || data.icon_slug || data.id,
        material_icon: data.material_icon || data.material_icon_name || 'event',
        color_class: data.color_class || 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
        icon_color_class: data.icon_color_class || 'text-slate-500'
      };
    } catch (err) {
      throw err;
    }
  }

  async update(dto: UpdateActivityIconDto): Promise<ActivityIcon> {
    const { slug, ...updateData } = dto;
    
    // Build update object without undefined values
    const updateObj: Record<string, unknown> = {};
    if (updateData.material_icon !== undefined) updateObj.material_icon = updateData.material_icon;
    if (updateData.color_class !== undefined) updateObj.color_class = updateData.color_class;
    if (updateData.icon_color_class !== undefined) updateObj.icon_color_class = updateData.icon_color_class;
    
    // Try to update by slug first
    const { data: dataBySlug, error: errorBySlug } = await this.supabase
      .from('activity_icons')
      .update(updateObj)
      .eq('slug', slug)
      .select('*')
      .maybeSingle();
    
    if (!errorBySlug && dataBySlug) {
      return {
        id: dataBySlug.id,
        slug: dataBySlug.slug || dataBySlug.icon_slug || dataBySlug.id,
        material_icon: dataBySlug.material_icon || dataBySlug.material_icon_name || 'event',
        color_class: dataBySlug.color_class || 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
        icon_color_class: dataBySlug.icon_color_class || 'text-slate-500'
      };
    }

    // Try by icon_slug
    const { data: dataByIconSlug, error: errorByIconSlug } = await this.supabase
      .from('activity_icons')
      .update(updateObj)
      .eq('icon_slug', slug)
      .select('*')
      .maybeSingle();
    
    if (!errorByIconSlug && dataByIconSlug) {
      return {
        id: dataByIconSlug.id,
        slug: dataByIconSlug.slug || dataByIconSlug.icon_slug || dataByIconSlug.id,
        material_icon: dataByIconSlug.material_icon || dataByIconSlug.material_icon_name || 'event',
        color_class: dataByIconSlug.color_class || 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
        icon_color_class: dataByIconSlug.icon_color_class || 'text-slate-500'
      };
    }

    // Fallback to id
    const { data, error } = await this.supabase
      .from('activity_icons')
      .update(updateObj)
      .eq('id', slug)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update activity icon: ${error.message}`);
    }

    return {
      id: data.id,
      slug: data.slug || data.icon_slug || data.id,
      material_icon: data.material_icon || data.material_icon_name || 'event',
      color_class: data.color_class || 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
      icon_color_class: data.icon_color_class || 'text-slate-500'
    };
  }

  async delete(slug: string): Promise<void> {
    // Try to delete by slug, then fallback to icon_slug or id
    const { error: errorBySlug } = await this.supabase
      .from('activity_icons')
      .delete()
      .eq('slug', slug);

    if (!errorBySlug) return;

    const { error: errorByIconSlug } = await this.supabase
      .from('activity_icons')
      .delete()
      .eq('icon_slug', slug);

    if (!errorByIconSlug) return;

    const { error } = await this.supabase
      .from('activity_icons')
      .delete()
      .eq('id', slug);

    if (error) {
      throw new Error(`Failed to delete activity icon: ${error.message}`);
    }
  }
}
