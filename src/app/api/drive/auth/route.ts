import { NextResponse } from "next/server";
import { stackServerApp } from "@stack/server";
import { getAuthUrl, revokeAccess } from "@/lib/google-drive";
import { prisma } from "@/lib/prisma";
import { ensureUserInDatabase } from "@/lib/ensureUser";

export async function GET() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await ensureUserInDatabase({
    id: stackUser.id,
    primaryEmail: stackUser.primaryEmail,
    displayName: stackUser.displayName,
    profileImageUrl: stackUser.profileImageUrl,
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const token = await prisma.googleDriveToken.findUnique({
    where: { userId: user.id },
  });
  const authUrl = getAuthUrl(user.id);

  return NextResponse.json({ authUrl, connected: !!token });
}

export async function DELETE() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await ensureUserInDatabase({
    id: stackUser.id,
    primaryEmail: stackUser.primaryEmail,
    displayName: stackUser.displayName,
    profileImageUrl: stackUser.profileImageUrl,
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  await revokeAccess(user.id);
  return NextResponse.json({ success: true });
}
