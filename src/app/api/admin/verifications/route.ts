export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import prisma from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const verifications = await prisma.hostProfile.findMany({
    where: { verificationStatus: "UNDER_REVIEW" },
    select: {
      id: true,
      verificationStatus: true,
      createdAt: true,
      ownershipType: true,
      isAgent: true,
      agentNumber: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          verificationDocuments: {
            where: { propertyId: null },
            select: {
              id: true,
              fileName: true,
              verificationType: true,
              webContentLink: true,
              webViewLink: true,
              createdAt: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(verifications);
}
