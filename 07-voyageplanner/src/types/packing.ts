export type PackingCategory =
  | 'Documents & Passports'
  | 'Clothing & Footwear'
  | 'Electronics & Tech'
  | 'Toiletries & Health'
  | 'Outdoor & Activity Gear'
  | 'Travel Essentials'
  | 'Emergency & Meds';

export interface PackingItem {
  id: string;
  tripId: string;
  category: PackingCategory;
  name: string;
  quantity: number;
  packed: boolean;
  assignedTo?: string; // Companion name or ID
  weightGrams?: number;
  essential: boolean;
  notes?: string;
}

export interface PackingCategoryProgress {
  category: PackingCategory;
  total: number;
  packed: number;
  percentage: number;
}
