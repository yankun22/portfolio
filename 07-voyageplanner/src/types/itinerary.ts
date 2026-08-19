export type ActivityCategory =
  | 'sightseeing'
  | 'dining'
  | 'lodging'
  | 'transit'
  | 'entertainment'
  | 'culture'
  | 'nature'
  | 'shopping'
  | 'relaxation';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ActivityLocation {
  name: string;
  address?: string;
  coords: Coordinates;
  city?: string;
  country?: string;
}

export interface Activity {
  id: string;
  dayId: string; // 'day-1', 'day-2', or 'bucket' (unscheduled)
  title: string;
  description?: string;
  location: ActivityLocation;
  category: ActivityCategory;
  startTime: string; // e.g. "09:00"
  durationMinutes: number; // e.g. 90
  cost: number;
  currency: string;
  booked: boolean;
  confirmationCode?: string;
  notes?: string;
  order: number;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  hotelOrBase?: ActivityLocation;
  themeColor?: string;
}

export interface TravelPace {
  level: 'Relaxed' | 'Moderate' | 'Packed';
  color: string;
  description: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  coverImage: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  primaryCurrency: string;
  totalBudget: number;
  days: ItineraryDay[];
  activities: Activity[];
  tags: string[];
}
