export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const search = req.nextUrl.searchParams.get("search") ?? "";
  const users = await prisma.user.findMany({
    where: search
      ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] }
      : undefined,
    select: {
      id: true, name: true, email: true, avatar: true,
      isHost: true, isAdmin: true, isBanned: true, verified: true, createdAt: true,
      _count: { select: { properties: true, bookings: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(users);
}
