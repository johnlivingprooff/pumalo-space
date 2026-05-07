import { NextResponse } from "next/server";
import { stackServerApp } from "@stack/server";
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

  const documents = await prisma.verificationDocument.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ documents });
}
