export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { action, reason } = await req.json(); // action: "approve" | "reject" | "needs_resubmission"

  const statusMap = {
    approve: "VERIFIED",
    reject: "REJECTED",
    needs_resubmission: "NEEDS_RESUBMISSION",
  } as const;

  const status = statusMap[action as keyof typeof statusMap];
  if (!status)
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  const property = await prisma.property.update({
    where: { id },
    data: {
      verificationStatus: status,
      rejectionReason: reason ?? null,
      verifiedAt: action === "approve" ? new Date() : null,
    },
    select: { id: true, verificationStatus: true },
  });

  return NextResponse.json(property);
}
