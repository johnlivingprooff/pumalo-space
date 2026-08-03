import { stackServerApp } from "@stack/server";
import { NextResponse } from "next/server";
import { ensureUserInDatabase } from "@/lib/ensureUser";
import { deleteFileFromDrive, getAccessToken } from "@/lib/google-drive";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;

  const document = await prisma.verificationDocument.findFirst({
    where: { id, userId: user.id },
  });
  if (!document)
    return NextResponse.json({ error: "Document not found" }, { status: 404 });

  // Remove the file from the user's Drive (best effort) before deleting the
  // database record, which is what the app actually reads.
  const accessToken = await getAccessToken(user.id);
  if (accessToken) {
    try {
      await deleteFileFromDrive(accessToken, document.fileId);
    } catch {
      // Ignore: a stray file in the user's own Drive is harmless.
    }
  }

  await prisma.verificationDocument.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
