'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { PropertyCardProps } from '@/types';
import { Badge } from '@/components/ui/Badge';

export const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  price,
  currency,
  pricePerPeriod = 'night',
  image,
  rating,
  reviewCount,
  propertyType,
  favoriteButton,
}) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Link href={`/properties/${id}`}>
      <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
          <img
            src={imageError ? 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop&q=80' : image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          
          {/* Favorite Button Slot */}
          {favoriteButton}
          
          {/* Property Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={propertyType === 'buy' ? 'success' : propertyType === 'lodge' ? 'info' : 'primary'}>
              {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
            </Badge>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Location & Rating */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </p>
            </div>
            
            {rating > 0 && (
              <div className="flex items-center gap-1 ml-2">
                <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({reviewCount})</span>
              </div>
            )}
          </div>
          
          {/* Price */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">
                {currency} {price.toLocaleString()}
              </span>
              {propertyType !== 'buy' && (
                <span className="text-sm text-gray-600">/ {pricePerPeriod}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
