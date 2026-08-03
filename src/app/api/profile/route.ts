export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@stack/server";
import prisma from "@/lib/prisma";
import { sanitizeUserProfile } from "@/lib/validation";

export async function PATCH(req: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const sanitized = sanitizeUserProfile(body);

  const { displayName, ...profileData } = sanitized;

  if (displayName) {
    try {
      await stackUser.update({ displayName });
    } catch {
      return NextResponse.json(
        { error: "Failed to update display name" },
        { status: 500 },
      );
    }
  }

  const user = await prisma.user.update({
    where: { id: stackUser.id },
    data: {
      ...profileData,
      ...(displayName ? { name: displayName } : {}),
    },
    select: {
      id: true,
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      bio: true,
      avatar: true,
    },
  });

  return NextResponse.json(user);
}
