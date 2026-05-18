export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const verifications = await prisma.hostProfile.findMany({
    where: { verificationStatus: "UNDER_REVIEW" },
    select: {
      id: true, verificationStatus: true, createdAt: true,
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Attach document counts
  const withDocs = await Promise.all(
    verifications.map(async (v) => {
      const docCount = await prisma.verificationDocument.count({ where: { userId: v.user.id } });
      return { ...v, docCount };
    })
  );

  return NextResponse.json(withDocs);
}
