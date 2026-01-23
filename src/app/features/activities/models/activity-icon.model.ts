export interface ActivityIcon {
  id: string;
  slug: string;
  material_icon: string;
  color_class: string;
  icon_color_class: string;
}

export type IconSlug = string;

export const ICON_REGISTRY: Record<string, { materialIcon: string; colorClass: string; iconColorClass: string }> = {
  // Material icon names from database (icon_slug values)
  'prayer': {
    materialIcon: 'mosque',
    colorClass: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    iconColorClass: 'text-amber-500'
  },
  'teaching': {
    materialIcon: 'menu_book',
    colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    iconColorClass: 'text-blue-500'
  },
  'youth': {
    materialIcon: 'groups',
    colorClass: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
    iconColorClass: 'text-emerald-500'
  },
  'community': {
    materialIcon: 'favorite',
    colorClass: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600',
    iconColorClass: 'text-pink-500'
  },
  'information': {
    materialIcon: 'info',
    colorClass: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600',
    iconColorClass: 'text-cyan-500'
  },
  'info': {
    materialIcon: 'info',
    colorClass: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600',
    iconColorClass: 'text-cyan-500'
  },
  // Legacy keys for backwards compatibility
  'mosque': {
    materialIcon: 'mosque',
    colorClass: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    iconColorClass: 'text-amber-500'
  },
  'menu_book': {
    materialIcon: 'menu_book',
    colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    iconColorClass: 'text-blue-500'
  },
  'groups': {
    materialIcon: 'groups',
    colorClass: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
    iconColorClass: 'text-emerald-500'
  },
  'favorite': {
    materialIcon: 'favorite',
    colorClass: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600',
    iconColorClass: 'text-pink-500'
  },
  'event': {
    materialIcon: 'event',
    colorClass: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600',
    iconColorClass: 'text-slate-500'
  }
};

export function getIconFromSlug(slug: IconSlug | null | undefined): { materialIcon: string; colorClass: string; iconColorClass: string } {
  if (!slug) {
    return ICON_REGISTRY['event'];
  }
  return ICON_REGISTRY[slug] || ICON_REGISTRY['event'];
}
