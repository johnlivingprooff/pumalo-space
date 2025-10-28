import React from 'react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import prisma from '@/lib/prisma';
import { PropertyType } from '@prisma/client';

interface SearchParams {
  type?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
}

async function getProperties(searchParams: SearchParams) {
  try {
    const where: any = {};
    
    // Filter by property type
    if (searchParams.type) {
      where.propertyType = searchParams.type.toUpperCase() as PropertyType;
    }
    
    // Filter by city
    if (searchParams.city) {
      where.city = {
        contains: searchParams.city,
        mode: 'insensitive',
      };
    }
    
    // Filter by price range
    if (searchParams.minPrice || searchParams.maxPrice) {
      where.price = {};
      if (searchParams.minPrice) {
        where.price.gte = parseFloat(searchParams.minPrice);
      }
      if (searchParams.maxPrice) {
        where.price.lte = parseFloat(searchParams.maxPrice);
      }
    }
    
    // Filter by bedrooms
    if (searchParams.bedrooms) {
      where.bedrooms = {
        gte: parseInt(searchParams.bedrooms),
      };
    }
    
    // Filter by bathrooms
    if (searchParams.bathrooms) {
      where.bathrooms = {
        gte: parseInt(searchParams.bathrooms),
      };
    }
    
    const properties = await prisma.property.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return properties;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const properties = await getProperties(searchParams);
  
  // Get unique cities for filter
  const allProperties = await prisma.property.findMany({
    select: { city: true },
    distinct: ['city'],
  });
  const cities = allProperties.map(p => p.city);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {searchParams.type 
              ? `Properties for ${searchParams.type.charAt(0).toUpperCase() + searchParams.type.slice(1)}`
              : 'All Properties'
            }
          </h1>
          <p className="mt-2 text-gray-600">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              
              <form className="space-y-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    name="type"
                    defaultValue={searchParams.type || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
                  >
                    <option value="">All Types</option>
                    <option value="rent">Rent</option>
                    <option value="buy">Buy</option>
                    <option value="lodge">Lodge</option>
                  </select>
                </div>
                
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    defaultValue={searchParams.city || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (KSH)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      defaultValue={searchParams.minPrice || ''}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600 placeholder:text-gray-400"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      defaultValue={searchParams.maxPrice || ''}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                
                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms (minimum)
                  </label>
                  <select
                    name="bedrooms"
                    defaultValue={searchParams.bedrooms || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                
                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms (minimum)
                  </label>
                  <select
                    name="bathrooms"
                    defaultValue={searchParams.bathrooms || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>
                
                {/* Apply Button */}
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Apply Filters
                </button>
                
                {/* Clear Filters */}
                <a
                  href="/properties"
                  className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Clear All
                </a>
              </form>
            </div>
          </aside>
          
          {/* Properties Grid */}
          <main className="lg:col-span-3">
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property: any) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    location={`${property.city}, ${property.country}`}
                    price={property.price}
                    currency={property.currency}
                    pricePerPeriod={property.pricePeriod || undefined}
                    image={property.images[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop&q=80'}
                    rating={property.rating}
                    reviewCount={property.reviewCount}
                    propertyType={property.propertyType.toLowerCase() as 'rent' | 'buy' | 'lodge'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
                <a
                  href="/properties"
                  className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
