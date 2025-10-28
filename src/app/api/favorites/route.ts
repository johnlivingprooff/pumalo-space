import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { stackServerApp } from '@/stack';

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { propertyId } = await request.json();
    if (!propertyId) return NextResponse.json({ error: 'propertyId required' }, { status: 400 });

    await prisma.favorite.create({
      data: {
        userId: user.id,
        propertyId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Unique constraint mean it's already favorited
    return NextResponse.json({ success: true });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    if (!propertyId) return NextResponse.json({ error: 'propertyId required' }, { status: 400 });

    await prisma.favorite.delete({
      where: {
        userId_propertyId: {
          userId: user.id,
          propertyId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update favorites' }, { status: 500 });
  }
}
