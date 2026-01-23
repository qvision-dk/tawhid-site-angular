import { Injectable, signal, inject } from '@angular/core';
import { ActivityIconsRepository } from '../../../core/data/activity-icons.repository';
import { ActivityIcon } from '../models/activity-icon.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityIconsService {
  private readonly iconsRepository = inject(ActivityIconsRepository);
  
  private readonly iconsCache = signal<Map<string, ActivityIcon>>(new Map());
  private readonly loading = signal<boolean>(false);

  async init(): Promise<void> {
    if (this.iconsCache().size > 0) {
      return;
    }

    this.loading.set(true);
    try {
      const icons = await this.iconsRepository.getAll();
      const cache = new Map<string, ActivityIcon>();
      icons.forEach(icon => {ieve
        // Cache by both slug and material_icon for lookup flexibility
        cache.set(icon.slug, icon);
        cache.set(icon.material_icon, icon);
      });
      this.iconsCache.set(cache);
    } catch (error) {
      console.error('Error loading icons:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getIconByMaterialIcon(materialIcon: string | null | undefined): ActivityIcon | null {
    if (!materialIcon) {
      return null;
    }
    const cache = this.iconsCache();
    // Try direct lookup
    const icon = cache.get(materialIcon);
    if (icon) return icon;
    
    // Try finding by slug
    for (const [key, value] of cache.entries()) {
      if (value.slug === materialIcon) {
        return value;
      }
    }
    
    return null;
  }

  getColorClass(materialIcon: string | null | undefined): string {
    if (!materialIcon) {
      return 'bg-slate-50 dark:bg-slate-900/20 text-slate-600';
    }
    
    // Try to find icon by material_icon name
    const icon = this.iconsCache().get(materialIcon);
    if (icon) {
      return icon.color_class || 'bg-slate-50 dark:bg-slate-900/20 text-slate-600';
    }
    
    // If not found, try to find by slug (materialIcon might be a slug)
    const cache = this.iconsCache();
    for (const [key, value] of cache.entries()) {
      if (value.slug === materialIcon) {
        return value.color_class || 'bg-slate-50 dark:bg-slate-900/20 text-slate-600';
      }
    }
    
    return 'bg-slate-50 dark:bg-slate-900/20 text-slate-600';
  }

  getIconColorClass(materialIcon: string | null | undefined): string {
    if (!materialIcon) {
      return 'text-slate-500';
    }
    
    // Try to find icon by material_icon name
    const icon = this.iconsCache().get(materialIcon);
    if (icon) {
      return icon.icon_color_class || 'text-slate-500';
    }
    
    // If not found, try to find by slug (materialIcon might be a slug)
    const cache = this.iconsCache();
    for (const [key, value] of cache.entries()) {
      if (value.slug === materialIcon) {
        return value.icon_color_class || 'text-slate-500';
      }
    }
    
    return 'text-slate-500';
  }

  getMaterialIcon(iconSlug: string | null | undefined): string {
    // Treat icon_slug as data - use it directly as the Material icon name
    // This follows the requirement: "Treat icon_slug as data" and "Render it directly"
    return iconSlug || 'event';
  }
}
