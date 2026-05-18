export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const allowed = ["isBanned", "isHost", "isAdmin"];
  const data: Record<string, boolean> = {};

  for (const key of allowed) {
    if (key in body) data[key] = Boolean(body[key]);
  }

  if (!Object.keys(data).length) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const user = await prisma.user.update({ where: { id }, data, select: { id: true, isBanned: true, isHost: true, isAdmin: true } });
  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
