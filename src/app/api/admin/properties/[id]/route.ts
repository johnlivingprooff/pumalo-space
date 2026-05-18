export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { featured } = await req.json();
  const property = await prisma.property.update({
    where: { id },
    data: { featured: Boolean(featured) },
    select: { id: true, featured: true },
  });
  return NextResponse.json(property);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.property.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
