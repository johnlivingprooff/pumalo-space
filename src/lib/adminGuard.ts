import { stackServerApp } from "@stack/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function requireAdmin() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: stackUser.id },
    select: { id: true, isAdmin: true },
  });

  if (!dbUser?.isAdmin) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), user: null };
  }

  return { error: null, user: dbUser };
}
