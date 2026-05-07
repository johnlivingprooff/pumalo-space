import { type NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@stack/server";
import { prisma } from "@/lib/prisma";
import { ensureUserInDatabase } from "@/lib/ensureUser";

async function getUser() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) return null;
  return ensureUserInDatabase({
    id: stackUser.id,
    primaryEmail: stackUser.primaryEmail,
    displayName: stackUser.displayName,
    profileImageUrl: stackUser.profileImageUrl,
  });
}

// GET /api/drafts/[id]
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const draft = await prisma.propertyDraft.findFirst({
    where: { id, userId: user.id },
  });
  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ draft });
}

// PATCH /api/drafts/[id] — upsert (auto-save)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data, step, title } = await request.json();

  const draft = await prisma.propertyDraft.updateMany({
    where: { id, userId: user.id },
    data: { data, step, title: title || null },
  });

  if (draft.count === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

// DELETE /api/drafts/[id]
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.propertyDraft.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ success: true });
}
