import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stackServerApp } from "@stack/server";
import { ensureUserInDatabase } from "@/lib/ensureUser";

export async function POST(request: NextRequest) {
  try {
    const stackUser = await stackServerApp.getUser();
    if (!stackUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureUserInDatabase({
      id: stackUser.id,
      primaryEmail: stackUser.primaryEmail,
      displayName: stackUser.displayName,
      profileImageUrl: stackUser.profileImageUrl,
    });

    const body = await request.json();
    const { propertyId, type, message, offerAmount, requestedDates, requestViewing } = body;

    if (!propertyId || !type || !message?.trim()) {
      return NextResponse.json({ error: "propertyId, type, and message are required" }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        title: true,
        hostId: true,
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (property.hostId === stackUser.id) {
      return NextResponse.json({ error: "Cannot inquire on your own property" }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId,
        senderId: stackUser.id,
        type,
        message: message.trim(),
        offerAmount: offerAmount ? Number(offerAmount) : null,
        requestedDates: requestedDates ?? null,
        requestViewing: requestViewing ?? false,
      },
    });

    return NextResponse.json({
      inquiry,
      hostContact: {
        name: property.host.name,
        avatar: property.host.avatar,
        email: property.host.email,
        phone: property.host.phone,
      },
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
