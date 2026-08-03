import { stackServerApp } from "@stack/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — fetch current verification status
export async function GET() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.hostProfile.findUnique({
    where: { userId: stackUser.id },
    select: {
      verificationStatus: true,
      rejectionReason: true,
      verifiedAt: true,
    },
  });

  if (!profile)
    return NextResponse.json(
      { error: "Host profile not found" },
      { status: 404 },
    );

  const docCount = await prisma.verificationDocument.count({
    where: { userId: stackUser.id, propertyId: null },
  });

  return NextResponse.json({ ...profile, documentCount: docCount });
}

// PATCH — host submits documents for review
export async function PATCH() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.hostProfile.findUnique({
    where: { userId: stackUser.id },
    select: { verificationStatus: true },
  });

  if (!profile)
    return NextResponse.json(
      { error: "Host profile not found" },
      { status: 404 },
    );

  // Only allow submission from PENDING, NEEDS_RESUBMISSION, or REJECTED
  const submittable = ["PENDING", "NEEDS_RESUBMISSION", "REJECTED"];
  if (!submittable.includes(profile.verificationStatus)) {
    return NextResponse.json(
      { error: "Cannot submit from current status" },
      { status: 400 },
    );
  }

  const docCount = await prisma.verificationDocument.count({
    where: { userId: stackUser.id, propertyId: null },
  });

  if (docCount === 0) {
    return NextResponse.json(
      { error: "Upload at least one document before submitting" },
      { status: 400 },
    );
  }

  const updated = await prisma.hostProfile.update({
    where: { userId: stackUser.id },
    data: { verificationStatus: "UNDER_REVIEW" },
    select: { verificationStatus: true },
  });

  return NextResponse.json(updated);
}
