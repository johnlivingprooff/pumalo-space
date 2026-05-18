export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { action, reason } = await req.json(); // action: "approve" | "reject" | "needs_resubmission"

  const statusMap: Record<string, string> = {
    approve: "VERIFIED",
    reject: "REJECTED",
    needs_resubmission: "NEEDS_RESUBMISSION",
  };

  const status = statusMap[action];
  if (!status) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  const profile = await prisma.hostProfile.update({
    where: { id },
    data: {
      verificationStatus: status as any,
      rejectionReason: reason ?? null,
      verifiedAt: action === "approve" ? new Date() : null,
    },
    select: { id: true, verificationStatus: true, userId: true },
  });

  // If approved, mark user as verified
  if (action === "approve") {
    await prisma.user.update({ where: { id: profile.userId }, data: { verified: true } });
  }

  return NextResponse.json(profile);
}
