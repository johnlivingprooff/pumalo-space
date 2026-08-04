import { stackServerApp } from "@stack/server";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isValidLicenseNumber, sanitizeLicenseNumber } from "@/lib/validation";

export async function PATCH(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const ealbNumber =
    typeof body.ealbNumber === "string" ? body.ealbNumber.trim() : "";
  const traNumber =
    typeof body.traNumber === "string" ? body.traNumber.trim() : "";

  const profile = await prisma.hostProfile.findUnique({
    where: { userId: stackUser.id },
    select: { ownershipType: true, propertyType: true },
  });
  if (!profile)
    return NextResponse.json(
      { error: "Host profile not found" },
      { status: 404 },
    );

  const needsEalb = profile.ownershipType === "manage";
  const needsTra = profile.propertyType === "LODGE";

  if (needsEalb && !ealbNumber) {
    return NextResponse.json(
      { error: "EALB Certificate Number is required" },
      { status: 400 },
    );
  }
  if (needsTra && !traNumber) {
    return NextResponse.json(
      { error: "TRA Number is required" },
      { status: 400 },
    );
  }

  if (ealbNumber && !isValidLicenseNumber(ealbNumber)) {
    return NextResponse.json(
      {
        error:
          "Invalid EALB Certificate Number (use letters and digits only, 4–30 characters)",
      },
      { status: 400 },
    );
  }
  if (traNumber && !isValidLicenseNumber(traNumber)) {
    return NextResponse.json(
      {
        error:
          "Invalid TRA Number (use letters and digits only, 4–30 characters)",
      },
      { status: 400 },
    );
  }

  const updated = await prisma.hostProfile.update({
    where: { userId: stackUser.id },
    data: {
      ealbNumber: needsEalb ? sanitizeLicenseNumber(ealbNumber) : null,
      traNumber: needsTra ? sanitizeLicenseNumber(traNumber) : null,
    },
    select: { ealbNumber: true, traNumber: true },
  });

  return NextResponse.json(updated);
}
