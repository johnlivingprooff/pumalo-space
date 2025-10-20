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
    const body = await request.json();
    
    // You would validate the user is authenticated here
    // const user = await stackServerApp.getUser();
    // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const property = await prisma.property.create({
      data: {
        ...body,
        propertyType: body.propertyType.toUpperCase(),
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
