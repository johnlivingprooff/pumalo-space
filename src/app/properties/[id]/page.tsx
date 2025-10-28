import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

async function getProperty(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true,
            createdAt: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
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
      },
    });
    
    return property;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await getProperty(params.id);
  
  if (!property) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-primary-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/properties" className="text-gray-600 hover:text-primary-600">
              Properties
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{property.title}</span>
          </nav>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Main Image */}
          <div className="md:col-span-2 md:row-span-2">
            <img
              src={property.images[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop&q=80'}
              alt={property.title}
              className="w-full h-[400px] md:h-[600px] object-cover rounded-xl"
            />
          </div>
          
          {/* Additional Images */}
          {property.images.slice(1, 5).map((image, index) => (
            <div key={index} className="hidden md:block">
              <img
                src={image}
                alt={`${property.title} - ${index + 2}`}
                className="w-full h-[290px] object-cover rounded-xl"
              />
            </div>
          ))}
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={property.propertyType === 'BUY' ? 'success' : property.propertyType === 'LODGE' ? 'info' : 'primary'}>
                  {property.propertyType}
                </Badge>
                {property.featured && (
                  <Badge variant="warning">Featured</Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{property.city}, {property.country}</span>
                </div>
                
                {property.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">{property.rating.toFixed(1)}</span>
                    <span>({property.reviewCount} reviews)</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Property Details */}
            <div className="flex flex-wrap gap-6 py-6 border-y border-gray-200">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-semibold text-gray-900">{property.bedrooms}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-semibold text-gray-900">{property.bathrooms}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Max Guests</p>
                  <p className="font-semibold text-gray-900">{property.maxGuests}</p>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
            
            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Reviews */}
            {property.reviews.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Reviews ({property.reviewCount})
                </h2>
                <div className="space-y-6">
                  {property.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold flex-shrink-0">
                          {review.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{review.user.name}</h3>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400' : 'fill-gray-300'}`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">
                    {property.currency} {property.price.toLocaleString()}
                  </span>
                  {property.propertyType !== 'BUY' && (
                    <span className="text-gray-600">/ {property.pricePeriod || 'night'}</span>
                  )}
                </div>
              </div>
              
              {/* Host Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Hosted by</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {property.host.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{property.host.name}</p>
                      {property.host.verified && (
                        <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Joined {new Date(property.host.createdAt).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Button variant="primary" size="lg" fullWidth>
                  {property.propertyType === 'BUY' ? 'Make an Offer' : 'Book Now'}
                </Button>
                <Button variant="outline" size="lg" fullWidth>
                  Contact Host
                </Button>
                <button className="w-full flex items-center justify-center gap-2 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
              
              {/* Report */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                  Report this listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
