import React from 'react';
import { redirect } from 'next/navigation';
import { stackServerApp } from '@/stack';
import { Button } from '@/components/ui/Button';
import { PropertyCardWrapper } from '@/components/host/PropertyCardWrapper';
import { EditPropertyLink } from '@/components/host/EditPropertyLink';
import prisma from '@/lib/prisma';
import Link from 'next/link';

async function getHostProperties(hostId: string) {
  try {
    const properties = await prisma.property.findMany({
      where: { hostId },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return properties;
  } catch (error) {
    console.error('Error fetching host properties:', error);
    // Return empty array instead of throwing to prevent page crash
    return [];
  }
}

export default async function HostListingsPage() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    redirect('/sign-in');
  }

  // Check if user is a host
  let dbUser;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: stackUser.id },
      select: { isHost: true },
    });
  } catch (error) {
    console.error('Database connection error:', error);
    // If database is unavailable, redirect to a maintenance page or show error
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Temporarily Unavailable</h1>
          <p className="text-gray-600 mb-6">
            We're experiencing technical difficulties. Please try again in a few minutes.
          </p>
          <Link href="/">
            <Button variant="primary">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!dbUser?.isHost) {
    redirect('/host/onboarding');
  }

  const properties = await getHostProperties(stackUser.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
              <p className="mt-2 text-gray-600">
                {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
              </p>
            </div>
            <Link href="/host/create-listing">
              <Button variant="primary" size="lg">
                Add Property
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCardWrapper key={property.id} propertyId={property.id}>
                <img
                  src={property.images[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop&q=80'}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {property.city}, {property.country}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      {property.currency} {property.price.toLocaleString()}
                    </span>
                    <EditPropertyLink propertyId={property.id} />
                  </div>
                </div>
              </PropertyCardWrapper>
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first listing and start earning
            </p>
            <Link href="/host/create-listing">
              <Button variant="primary" size="lg">
                Add Your First Property
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
