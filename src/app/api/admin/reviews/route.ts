export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const search = req.nextUrl.searchParams.get("search") ?? "";
  const reviews = await prisma.review.findMany({
    where: search ? { comment: { contains: search, mode: "insensitive" } } : undefined,
    select: {
      id: true, rating: true, comment: true, createdAt: true,
      user: { select: { id: true, name: true, email: true } },
      property: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(reviews);
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await req.json();
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
