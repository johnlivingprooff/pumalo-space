export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [users, properties, pendingVerifications, reviews] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.hostProfile.count({ where: { verificationStatus: "UNDER_REVIEW" } }),
    prisma.review.count(),
  ]);

  return NextResponse.json({ users, properties, pendingVerifications, reviews });
}
