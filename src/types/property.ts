export type PropertyType = 'rent' | 'buy' | 'lodge';

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
  price: number;
  currency: string;
  pricePeriod?: string | null;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
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
  initialIsFavorite?: boolean;
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
