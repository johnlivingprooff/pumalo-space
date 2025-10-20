import type { PropertyType } from './property';

export interface FilterOption {
  id: string;
  label: string;
  value: string | number;
  count?: number;
}

export interface PriceRangeFilter {
  min: number;
  max: number;
  step?: number;
}

export interface DateRangeFilter {
  checkIn: Date | null;
  checkOut: Date | null;
}

export interface LocationFilter {
  city?: string;
  state?: string;
  country?: string;
  radius?: number; // in kilometers
}

export interface AmenityFilter {
  id: string;
  name: string;
  icon?: string;
  selected: boolean;
}

export interface FilterState {
  propertyTypes: PropertyType[];
  priceRange: PriceRangeFilter;
  dateRange: DateRangeFilter;
  location: LocationFilter;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
}

export interface SortOption {
  id: string;
  label: string;
  value: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';
}
