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
    const { stackServerApp } = await import('@stack/server');

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

    // Import and use validation
    const { validatePropertyData, sanitizeString } = await import('@/lib/validation');
    const validation = validatePropertyData(body);
    
    if (!validation.valid) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }

    // Sanitize text fields
    const sanitizedData = {
      ...body,
      title: sanitizeString(body.title, 200),
      description: sanitizeString(body.description, 5000),
      address: sanitizeString(body.address, 200),
      city: sanitizeString(body.city, 100),
      state: body.state ? sanitizeString(body.state, 100) : null,
      country: sanitizeString(body.country, 100),
      zipCode: body.zipCode ? sanitizeString(body.zipCode, 20) : null,
      pricePeriod: body.pricePeriod ? sanitizeString(body.pricePeriod, 20) : null,
    };

    // Create the property
    const property = await prisma.property.create({
      data: {
        ...sanitizedData,
        hostId: user.id,
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
