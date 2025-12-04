import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { stackServerApp } from '@/stack';

export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Users can only check their own host status
    if (!userId || userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { isHost: true },
    });

    return NextResponse.json({ isHost: dbUser?.isHost || false });
  } catch (error) {
    console.error('Error checking host status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
