// Ensure this route is always dynamic and not statically prerendered
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true,
            isHost: true,
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
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Import stackServerApp for authentication
    const { stackServerApp } = await import('@stack/server');

    // Verify user is authenticated
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if property exists and user owns it
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { hostId: true },
    });

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if (existingProperty.hostId !== user.id) {
      return NextResponse.json({ error: 'You do not have permission to edit this property' }, { status: 403 });
    }

    // Validate required fields
    const requiredFields = [
      'title', 'description', 'propertyType', 'address', 'city', 'country',
      'price', 'images', 'bedrooms', 'bathrooms', 'maxGuests'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate property type
    const validTypes = ['RENT', 'BUY', 'LODGE'];
    if (!validTypes.includes(body.propertyType)) {
      return NextResponse.json({ error: 'Invalid property type' }, { status: 400 });
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        ...body,
        propertyType: body.propertyType.toUpperCase(),
        images: body.images || [],
        amenities: body.amenities || [],
        availability: body.availability || [],
      },
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
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Import stackServerApp for authentication
    const { stackServerApp } = await import('@/../stack/server');

    // Verify user is authenticated
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if property exists and user owns it
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { hostId: true },
    });

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if (existingProperty.hostId !== user.id) {
      return NextResponse.json({ error: 'You do not have permission to delete this property' }, { status: 403 });
    }

    // Delete the property
    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
