import React from 'react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/Button';
import { HeroSection } from '@/components/HeroSection';
import Link from 'next/link';
import prisma from '@/lib/prisma';

async function getFeaturedProperties() {
  try {
    const properties = await prisma.property.findMany({
      where: { featured: true },
      take: 4,
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

const popularDestinations = [
  { name: 'Nairobi', count: 245, image: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&h=600&fit=crop&q=80' },
  { name: 'Mombasa', count: 189, image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&h=600&fit=crop&q=80' },
  { name: 'Kisumu', count: 127, image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop&q=80' },
  { name: 'Nakuru', count: 98, image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop&q=80' },
];

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked properties just for you
            </p>
          </div>
          
          {featuredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {featuredProperties.map((property: any) => (
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
              
              <div className="text-center">
                <Link href="/properties">
                  <Button variant="primary" size="lg">
                    View All Properties
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No properties found. Add some properties to get started!</p>
              <Link href="/host/create-listing">
                <Button variant="primary" size="lg">
                  List Your First Property
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600">
              Explore properties in trending locations
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <Link
                key={destination.name}
                href={`/properties?location=${destination.name}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                  <p className="text-sm text-blue-100">{destination.count} properties</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Finding your perfect space is easy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">
                Browse through thousands of verified properties
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Compare</h3>
              <p className="text-gray-600">
                Compare prices, amenities, and locations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Book</h3>
              <p className="text-gray-600">
                Secure your property with our safe booking system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to List Your Property?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of hosts and start earning today
          </p>
          <Link href="/host/create-listing">
            <Button variant="secondary" size="lg">
              Become a Host
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

