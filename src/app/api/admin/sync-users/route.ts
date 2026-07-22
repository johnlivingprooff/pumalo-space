export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { stackServerApp } from "@stack/server";
import { ensureUserInDatabase } from "@/lib/ensureUser";
import prisma from "@/lib/prisma";

export async function POST() {
  const { error } = await requireAdmin();
  if (error) return error;

  const before = await prisma.user.count();
  let cursor: string | undefined;

  do {
    const page = await stackServerApp.listUsers({ cursor, limit: 100 });
    for (const authUser of page) {
      await ensureUserInDatabase({
        id: authUser.id,
        primaryEmail: authUser.primaryEmail,
        displayName: authUser.displayName,
        profileImageUrl: authUser.profileImageUrl,
      });
    }
    cursor = (page as { nextCursor?: string | null }).nextCursor ?? undefined;
  } while (cursor);

  const after = await prisma.user.count();

  return NextResponse.json({
    total: after,
    synced: after - before,
  });
}
