export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import prisma from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const properties = await prisma.property.findMany({
    where: { verificationStatus: "UNDER_REVIEW" },
    select: {
      id: true,
      title: true,
      city: true,
      country: true,
      propertyType: true,
      verificationStatus: true,
      createdAt: true,
      host: { select: { id: true, name: true, email: true, avatar: true } },
      verificationDocuments: {
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
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(properties);
}
