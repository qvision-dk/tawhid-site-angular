export type RepeatBadge = 'weekly' | 'monthly' | 'yearly';

export interface Activity {
  id: string;
  title: string;
  description?: string;
  typeSlug: string;
  typeLabel: string;
  repeatBadge?: RepeatBadge;
  date?: string;
  weekday?: number;
  startTime?: string;
  endTime?: string;
  location?: string;
  isActive?: boolean;
}
