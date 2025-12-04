import React from 'react';
import { redirect } from 'next/navigation';
import { stackServerApp } from '@stack/server';
import { Button } from '@/components/ui/Button';
import { DeletePropertyButton } from '@/components/host/DeletePropertyButton';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

interface PageParams {
  id: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

async function getPropertyDetails(propertyId: string, hostId: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
            bookings: true,
          },
        },
      },
    });

    // Check if property exists and user owns it
    if (!property || property.hostId !== hostId) {
      return null;
    }

    return property;
  } catch (error) {
    console.error('Error fetching property details:', error);
    return null;
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;

  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    redirect('/sign-in');
  }

  // Check if user is a host
  const dbUser = await prisma.user.findUnique({
    where: { id: stackUser.id },
    select: { isHost: true },
  });

  if (!dbUser?.isHost) {
    redirect('/host/onboarding');
  }

  const property = await getPropertyDetails(id, stackUser.id);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5m.5-4a7.963 7.963 0 015.5-2.5c2.34 0 4.29.98 5.5 2.5m-.5 4H7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/host/listings">
            <Button variant="primary">Back to Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number, currency: string, period: string) => {
    const formattedPrice = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency === 'KSH' ? 'KES' : currency,
      minimumFractionDigits: 0,
    }).format(price);

    return `${formattedPrice}${period !== 'total' ? `/${period}` : ''}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/host/listings">
                <Button variant="outline" size="sm">
                  ← Back to Listings
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                <p className="text-gray-600">{property.city}, {property.country}</p>
              </div>
            </div>
            <Link href={`/host/listings/${property.id}/edit`}>
              <Button variant="primary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Property
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={property.images[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop&q=80'}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              {property.images.length > 1 && (
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {property.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${property.title} ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{property.maxGuests}</div>
                  <div className="text-sm text-gray-600">Max Guests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{property._count.bookings}</div>
                  <div className="text-sm text-gray-600">Bookings</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">
                    {property.address}, {property.city}
                    {property.state && `, ${property.state}`}
                    {property.zipCode && ` ${property.zipCode}`}, {property.country}
                  </p>
                </div>

                {property.amenities.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(property.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {property.rating.toFixed(1)} ({property._count.reviews} reviews)
                  </span>
                </div>
              </div>

              {property.reviews.length > 0 ? (
                <div className="space-y-6">
                  {property.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {review.user.avatar ? (
                            <Image
                              src={review.user.avatar}
                              alt={review.user.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {review.user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{review.user.name}</span>
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {property._count.reviews > 10 && (
                    <div className="text-center pt-4">
                      <p className="text-gray-600 text-sm">
                        And {property._count.reviews - 10} more reviews...
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No reviews yet</p>
                  <p className="text-sm text-gray-400 mt-1">Reviews will appear here once guests leave feedback</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  {formatPrice(property.price, property.currency, property.pricePeriod || 'night')}
                </div>
                <div className="text-sm text-gray-600">
                  {property.propertyType.toLowerCase()} • {property.pricePeriod || 'night'}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-medium">{property._count.bookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorites</span>
                  <span className="font-medium">{property._count.favorites}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-medium">{property.rating.toFixed(1)} ⭐</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href={`/host/listings/${property.id}/edit`}>
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Property
                  </Button>
                </Link>

                <DeletePropertyButton
                  propertyId={property.id}
                  propertyTitle={property.title}
                />
              </div>
            </div>

            {/* Property Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Property Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    property.featured
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {property.featured ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visibility</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}