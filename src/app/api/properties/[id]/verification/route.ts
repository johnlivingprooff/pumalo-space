export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { stackServerApp } from "@stack/server";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const property = await prisma.property.findFirst({
    where: { id, hostId: stackUser.id },
    select: { id: true, verificationStatus: true },
  });
  if (!property)
    return NextResponse.json({ error: "Property not found" }, { status: 404 });

  const submittable = ["PENDING", "NEEDS_RESUBMISSION", "REJECTED"];
  if (!submittable.includes(property.verificationStatus)) {
    return NextResponse.json(
      { error: "Cannot submit from current status" },
      { status: 400 },
    );
  }

  const docCount = await prisma.verificationDocument.count({
    where: { propertyId: id },
  });
  if (docCount === 0) {
    return NextResponse.json(
      { error: "Upload at least one document before submitting" },
      { status: 400 },
    );
  }

  const updated = await prisma.property.update({
    where: { id },
    data: { verificationStatus: "UNDER_REVIEW" },
    select: { id: true, verificationStatus: true },
  });

  return NextResponse.json(updated);
}
