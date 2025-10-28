import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ isHost: false }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isHost: true },
    });

    return NextResponse.json({ isHost: user?.isHost || false });
  } catch (error) {
    console.error('Error checking host status:', error);
    return NextResponse.json({ isHost: false }, { status: 500 });
  }
}
