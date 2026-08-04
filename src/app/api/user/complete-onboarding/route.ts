import { stackServerApp } from "@stack/server";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  isValidLicenseNumber,
  sanitizeLicenseNumber,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const stackUser = await stackServerApp.getUser();
    if (!stackUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse body (support JSON and form submissions)
    const contentType = request.headers.get("content-type") || "";
    let body: any = {};
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.formData();
      body = Object.fromEntries(form.entries());
    }

    // Extract and coerce types
    const rawPhone = body.phone;
    const rawBio = body.bio;
    const rawOwnershipType = body.ownershipType;
    const rawPropertyName = body.propertyName;
    const rawPropertyType = body.propertyType;
    const rawPropertyCity = body.propertyCity;
    const rawIdType = body.idType;
    const rawIdNumber = body.idNumber;
    const rawEalbNumber = body.ealbNumber;
    const rawTraNumber = body.traNumber;

    const phone = typeof rawPhone === "string" ? rawPhone.trim() : "";
    const bio = typeof rawBio === "string" ? rawBio.trim() : "";
    const ownershipType =
      typeof rawOwnershipType === "string" ? rawOwnershipType.trim() : "";
    const propertyName =
      typeof rawPropertyName === "string" ? rawPropertyName.trim() : "";
    const propertyType =
      typeof rawPropertyType === "string" ? rawPropertyType.trim() : "";
    const propertyCity =
      typeof rawPropertyCity === "string" ? rawPropertyCity.trim() : "";
    const idType = typeof rawIdType === "string" ? rawIdType.trim() : "";
    const idNumber = typeof rawIdNumber === "string" ? rawIdNumber.trim() : "";
    const ealbNumber =
      typeof rawEalbNumber === "string" ? rawEalbNumber.trim() : "";
    const traNumber =
      typeof rawTraNumber === "string" ? rawTraNumber.trim() : "";

    const validOwnership = ["own", "manage"];
    const validPropertyTypes = ["RENT", "BUY", "LODGE"];

    // Validate required fields
    if (
      !phone ||
      !ownershipType ||
      !validOwnership.includes(ownershipType) ||
      !propertyName ||
      !propertyType ||
      !validPropertyTypes.includes(propertyType) ||
      !propertyCity ||
      !idType ||
      !idNumber
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 },
      );
    }

    // License numbers: EALB for agents managing on behalf of owners, TRA for
    // short-term / holiday rentals (Airbnb-style).
    const needsEalb = ownershipType === "manage";
    const needsTra = propertyType === "LODGE";
    const sanitizedEalbNumber = sanitizeLicenseNumber(ealbNumber);
    const sanitizedTraNumber = sanitizeLicenseNumber(traNumber);

    if (needsEalb && !ealbNumber) {
      return NextResponse.json(
        { error: "EALB certificate number is required for agents" },
        { status: 400 },
      );
    }
    if (needsEalb && !isValidLicenseNumber(ealbNumber)) {
      return NextResponse.json(
        {
          error:
            "Invalid EALB certificate number (use letters and digits only, 4–30 characters)",
        },
        { status: 400 },
      );
    }
    if (needsTra && !traNumber) {
      return NextResponse.json(
        {
          error:
            "TRA (Tourism Regulatory Authority) number is required for short-term rentals",
        },
        { status: 400 },
      );
    }
    if (needsTra && !isValidLicenseNumber(traNumber)) {
      return NextResponse.json(
        {
          error:
            "Invalid TRA number (use letters and digits only, 4–30 characters)",
        },
        { status: 400 },
      );
    }

    // Persist onboarding details and set user as host
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: stackUser.id },
        data: {
          phone,
          ...(bio ? { bio } : {}),
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
          ownershipType,
          ealbNumber: needsEalb ? sanitizedEalbNumber : null,
          traNumber: needsTra ? sanitizedTraNumber : null,
          propertyName,
          propertyType,
          propertyCity,
        },
        update: {
          idType,
          idNumber,
          ownershipType,
          ealbNumber: needsEalb ? sanitizedEalbNumber : null,
          traNumber: needsTra ? sanitizedTraNumber : null,
          propertyName,
          propertyType,
          propertyCity,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Successfully completed host onboarding",
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 },
    );
  }
}
