import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { ActivityType } from '../../features/activities/models/activity-type.model';
import { ActivityIconsRepository } from './activity-icons.repository';

export interface CreateActivityTypeDto {
  icon_slug: string;
  label: string;
  sort_order?: number;
}

export interface UpdateActivityTypeDto {
  id: string;
  icon_slug?: string;
  label?: string;
  sort_order?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityTypesRepository {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly iconsRepository = inject(ActivityIconsRepository);
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
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false });

    if (error) {
      throw new Error(`Failed to load activity types: ${error.message}`);
    }

    // Map data and get icon slug from icon_id if needed
    const mappedTypes = await Promise.all((data || []).map(async (item: {
      id: string;
      icon_id?: string;
      slug?: string;
      type_slug?: string;
      label: string;
      sort_order?: number;
    }) => {
      let slug = item.slug || item.type_slug;
      
      // If no slug but we have icon_id, get slug from icon
      if (!slug && item.icon_id) {
        try {
          const icon = await this.iconsRepository.getBySlug(item.icon_id);
          slug = icon?.slug;
        } catch (err) {
          // If icon lookup fails, use id as fallback
          console.warn(`Failed to load icon for icon_id ${item.icon_id}:`, err);
        }
      }

      return {
        id: item.id,
        slug: slug || item.id,
        label: item.label,
        sortOrder: item.sort_order
      };
    }));

    return mappedTypes;
  }

  async getBySlug(slug: string): Promise<ActivityType | null> {
    // Try to find by slug column first, then fallback to type_slug or id
    let query = this.supabase
      .from('activity_types')
      .select('*');
    
    // Try slug first, then type_slug, then id
    const { data: dataBySlug, error: errorBySlug } = await query.eq('slug', slug).maybeSingle();
    if (!errorBySlug && dataBySlug) {
      return {
        id: dataBySlug.id,
        slug: dataBySlug.slug || dataBySlug.type_slug || dataBySlug.id,
        label: dataBySlug.label,
        sortOrder: dataBySlug.sort_order
      };
    }

    const { data: dataByTypeSlug, error: errorByTypeSlug } = await query.eq('type_slug', slug).maybeSingle();
    if (!errorByTypeSlug && dataByTypeSlug) {
      return {
        id: dataByTypeSlug.id,
        slug: dataByTypeSlug.slug || dataByTypeSlug.type_slug || dataByTypeSlug.id,
        label: dataByTypeSlug.label,
        sortOrder: dataByTypeSlug.sort_order
      };
    }

    // Fallback to id if slug matches id
    const { data, error } = await this.supabase
      .from('activity_types')
      .select('*')
      .eq('id', slug)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to load activity type: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      slug: data.slug || data.type_slug || data.id,
      label: data.label,
      sortOrder: data.sort_order
    };
  }

  async create(dto: CreateActivityTypeDto): Promise<ActivityType> {
    // Find icon_id from icon_slug
    const icon = await this.iconsRepository.getBySlug(dto.icon_slug);
    if (!icon) {
      throw new Error(`Activity icon with slug "${dto.icon_slug}" not found`);
    }

    const insertData: Record<string, unknown> = {
      icon_id: icon.id,
      label: dto.label,
      ...(dto.sort_order !== undefined && { sort_order: dto.sort_order })
    };

    // Try to include slug if column exists
    try {
      const { data, error } = await this.supabase
        .from('activity_types')
        .insert({ ...insertData, slug: dto.icon_slug })
        .select('*')
        .single();

      if (error) {
        // If error is about missing slug column, try without it
        if (error.message.includes('slug') || error.message.includes('column')) {
          const { data: dataWithoutSlug, error: errorWithoutSlug } = await this.supabase
            .from('activity_types')
            .insert(insertData)
            .select('*')
            .single();

          if (errorWithoutSlug) {
            throw new Error(`Failed to create activity type: ${errorWithoutSlug.message}`);
          }

          return {
            id: dataWithoutSlug.id,
            slug: dataWithoutSlug.slug || dataWithoutSlug.type_slug || icon.slug,
            label: dataWithoutSlug.label,
            sortOrder: dataWithoutSlug.sort_order
          };
        }
        throw new Error(`Failed to create activity type: ${error.message}`);
      }

      return {
        id: data.id,
        slug: data.slug || data.type_slug || icon.slug,
        label: data.label,
        sortOrder: data.sort_order
      };
    } catch (err) {
      throw err;
    }
  }

  async update(dto: UpdateActivityTypeDto): Promise<ActivityType> {
    const { id, icon_slug, ...updateData } = dto;
    
    // Build update object without undefined values
    const updateObj: Record<string, unknown> = {};
    if (updateData.label !== undefined) updateObj.label = updateData.label;
    if (updateData.sort_order !== undefined) updateObj.sort_order = updateData.sort_order;
    
    // If icon_slug is provided, find icon_id
    if (icon_slug !== undefined) {
      const icon = await this.iconsRepository.getBySlug(icon_slug);
      if (!icon) {
        throw new Error(`Activity icon with slug "${icon_slug}" not found`);
      }
      updateObj.icon_id = icon.id;
    }

    const { data, error } = await this.supabase
      .from('activity_types')
      .update(updateObj)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update activity type: ${error.message}`);
    }

    // Get icon slug for return value
    let slug = data.slug || data.type_slug;
    if (!slug && data.icon_id) {
      const icon = await this.iconsRepository.getBySlug(data.icon_id);
      slug = icon?.slug || data.icon_id;
    }

    return {
      id: data.id,
      slug: slug || data.id,
      label: data.label,
      sortOrder: data.sort_order
    };
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('activity_types')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete activity type: ${error.message}`);
    }
  }
}
