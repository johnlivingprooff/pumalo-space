// Ensure this route is always dynamic and not statically prerendered
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const propertyType = searchParams.get('propertyType');
    const city = searchParams.get('city');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    
    const where: any = {};
    
    if (propertyType) {
      where.propertyType = propertyType.toUpperCase();
    }
    
    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive',
      };
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    const properties = await prisma.property.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Import stackServerApp for authentication
    const { stackServerApp } = await import('@/stack');

    // Verify user is authenticated
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a host
    const { prisma } = await import('@/lib/prisma');
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isHost: true },
    });

    if (!dbUser?.isHost) {
      return NextResponse.json({ error: 'Only hosts can create listings' }, { status: 403 });
    }

    const body = await request.json();

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

    const property = await prisma.property.create({
      data: {
        ...body,
        hostId: user.id,
        propertyType: body.propertyType.toUpperCase(),
        // Ensure arrays are properly handled
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

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
