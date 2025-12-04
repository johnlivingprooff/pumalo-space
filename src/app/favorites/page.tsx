import React from 'react';
import { redirect } from 'next/navigation';
import { stackServerApp } from '@stack/server';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { RemoveFavoriteButton } from '@/components/favorites/RemoveFavoriteButton';
import prisma from '@/lib/prisma';
import { ensureUserInDatabase } from '@/lib/ensureUser';

async function getUserFavorites(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return favorites;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

export default async function FavoritesPage() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    redirect('/sign-in');
  }

  // Auto-sync: Ensure user exists in database
  await ensureUserInDatabase({
    id: stackUser.id,
    primaryEmail: stackUser.primaryEmail,
    displayName: stackUser.displayName,
    profileImageUrl: stackUser.profileImageUrl,
  });

  const favorites = await getUserFavorites(stackUser.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="mt-2 text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(({ property }) => (
              <div key={property.id} className="group relative">
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <RemoveFavoriteButton propertyId={property.id} />
                </div>
                <PropertyCard
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring and save your favorite properties for later
            </p>
            <a
              href="/properties"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Browse Properties
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
