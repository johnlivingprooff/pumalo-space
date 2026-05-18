export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const search = req.nextUrl.searchParams.get("search") ?? "";
  const properties = await prisma.property.findMany({
    where: search
      ? { OR: [{ title: { contains: search, mode: "insensitive" } }, { city: { contains: search, mode: "insensitive" } }] }
      : undefined,
    select: {
      id: true, title: true, city: true, country: true, propertyType: true,
      price: true, featured: true, createdAt: true,
      host: { select: { id: true, name: true, email: true } },
      _count: { select: { reviews: true, bookings: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(properties);
}
