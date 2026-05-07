import { type NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@stack/server";
import { prisma } from "@/lib/prisma";
import { ensureUserInDatabase } from "@/lib/ensureUser";

async function getUser(_req?: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) return null;

  return ensureUserInDatabase({
    id: stackUser.id,
    primaryEmail: stackUser.primaryEmail,
    displayName: stackUser.displayName,
    profileImageUrl: stackUser.profileImageUrl,
  });
}

// GET /api/drafts — list all drafts for current user
export async function GET() {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const drafts = await prisma.propertyDraft.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      title: true,
      step: true,
      updatedAt: true,
      createdAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ drafts });
}

// POST /api/drafts — create a new draft
export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, step, title } = await request.json();

  const draft = await prisma.propertyDraft.create({
    data: { userId: user.id, data, step: step ?? 1, title: title || null },
  });

  return NextResponse.json({ draft });
}
