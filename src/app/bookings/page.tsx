import React from 'react';
import { redirect } from 'next/navigation';
import { stackServerApp } from '@/stack';
import { Badge } from '@/components/ui/Badge';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { CancelBookingButton } from '@/components/bookings/CancelBookingButton';
import { ensureUserInDatabase } from '@/lib/ensureUser';

async function getUserBookings(userId: string) {
  try {
    const bookings = await prisma.booking.findMany({
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
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'CANCELLED':
      return 'error';
    case 'COMPLETED':
      return 'default';
    default:
      return 'default';
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function calculateNights(checkIn: Date, checkOut: Date) {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function BookingsPage() {
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

  const bookings = await getUserBookings(stackUser.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">
            {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const nights = calculateNights(booking.checkIn, booking.checkOut);
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Property Image */}
                      <Link
                        href={`/properties/${booking.property.id}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={booking.property.images[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop&q=80'}
                          alt={booking.property.title}
                          className="w-full lg:w-48 h-48 object-cover rounded-lg"
                        />
                      </Link>

                      {/* Booking Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/properties/${booking.property.id}`}
                              className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                            >
                              {booking.property.title}
                            </Link>
                            <p className="text-sm text-gray-600 mt-1">
                              {booking.property.city}, {booking.property.country}
                            </p>
                          </div>
                          <Badge variant={getStatusColor(booking.status) as any}>
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Check-in
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(booking.checkIn)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Check-out
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(booking.checkOut)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Duration
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {nights} {nights === 1 ? 'night' : 'nights'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Guests
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                            </p>
                          </div>
                        </div>

                        {booking.specialRequests && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Special Requests
                            </p>
                            <p className="text-sm text-gray-700">{booking.specialRequests}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Total Price
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              {booking.currency} {booking.totalPrice.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/properties/${booking.property.id}`}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              View Property
                            </Link>
                            {booking.status === 'PENDING' && (
                              <CancelBookingButton bookingId={booking.id} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">
              Start planning your next adventure by booking a property
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
