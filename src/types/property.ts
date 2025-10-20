export type PropertyType = 'rent' | 'buy' | 'lodge';

export interface Location {
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Price {
  amount: number;
  currency: string;
  period?: 'night' | 'week' | 'month' | 'total';
}

export interface Rooms {
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  location: Location;
  price: Price;
  images: string[];
  amenities: string[];
  rooms: Rooms;
  hostId: string;
  rating: number;
  reviewCount: number;
  availability: Date[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  pricePerPeriod?: string;
  image: string;
  rating: number;
  reviewCount: number;
  propertyType: PropertyType;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

export interface PropertyFilters {
  propertyType?: PropertyType[];
  priceRange?: {
    min: number;
    max: number;
  };
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
}
