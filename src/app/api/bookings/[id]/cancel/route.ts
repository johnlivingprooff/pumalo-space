import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { stackServerApp } from '@/stack';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: bookingId } = await params;
    if (!bookingId) return NextResponse.json({ error: 'Missing booking id' }, { status: 400 });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, userId: true, status: true },
    });

    if (!booking || booking.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (booking.status !== 'PENDING') {
      return NextResponse.json({ error: 'Only pending bookings can be cancelled' }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      select: { id: true, status: true },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
