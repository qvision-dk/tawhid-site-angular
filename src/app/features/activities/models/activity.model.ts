export type RepeatBadge = 'weekly' | 'monthly' | 'yearly';

// Public view model (from activities_public_view)
export interface Activity {
  id: string;
  title: string;
  description?: string;
  activityTypeId: string;
  activityTypeLabel: string;
  iconSlug?: string;
  repeatBadge?: RepeatBadge;
  date?: string;
  weekday?: number;
  startTime?: string;
  endTime?: string;
  location?: string;
  isActive?: boolean;
}

// Admin model (from raw activities table)
export interface ActivityAdmin {
  id: string;
  title: string;
  description?: string | null;
  activity_type_id: string;
  repeat_badge?: RepeatBadge | null;
  date?: string | null;
  weekday?: number | null;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  is_active?: boolean;
}
