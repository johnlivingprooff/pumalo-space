import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { stackServerApp } from '@/stack';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const stackUser = await stackServerApp.getUser();
    if (!stackUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse body (support JSON and form submissions)
    const contentType = request.headers.get('content-type') || '';
    let body: any = {};
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const form = await request.formData();
      body = Object.fromEntries(form.entries());
    }

    // Extract and coerce types
    const rawPhone = body.phone;
    const rawBio = body.bio;
    const rawIdType = body.idType;
    const rawIdNumber = body.idNumber;
    const rawPaymentMethod = body.paymentMethod;
    const rawAccountDetails = body.accountDetails;

    const phone = typeof rawPhone === 'string' ? rawPhone.trim() : '';
    const bio = typeof rawBio === 'string' ? rawBio.trim() : '';
    const idType = typeof rawIdType === 'string' ? rawIdType.trim() : '';
    const idNumber = typeof rawIdNumber === 'string' ? rawIdNumber.trim() : '';
    const paymentMethod = typeof rawPaymentMethod === 'string' ? rawPaymentMethod.trim() : '';
    const accountDetails =
      typeof rawAccountDetails === 'string'
        ? rawAccountDetails
        : rawAccountDetails != null
        ? JSON.stringify(rawAccountDetails)
        : '';

    // Validate required fields
    if (!phone || !bio || !idType || !idNumber || !paymentMethod || !accountDetails) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Persist onboarding details and set user as host
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: stackUser.id },
        data: {
          phone,
          bio,
          isHost: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          isHost: true,
        },
      }),
      // Using any to avoid transient type mismatch if Prisma types are stale
      (prisma as any).hostProfile.upsert({
        where: { userId: stackUser.id },
        create: {
          userId: stackUser.id,
          idType,
          idNumber,
          paymentMethod,
          accountDetails,
        },
        update: {
          idType,
          idNumber,
          paymentMethod,
          accountDetails,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Successfully completed host onboarding',
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
