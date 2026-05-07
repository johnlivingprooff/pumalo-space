import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@stack/server";
import { getAccessToken, getFileMetadata } from "@/lib/google-drive";
import { prisma } from "@/lib/prisma";
import { ensureUserInDatabase } from "@/lib/ensureUser";
import type { VerificationType } from "@prisma/client";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: NextRequest) {
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

  const accessToken = await getAccessToken(user.id);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Google Drive not connected" },
      { status: 403 },
    );
  }

  const { fileId, verificationType } = await request.json();
  if (!fileId || !verificationType) {
    return NextResponse.json(
      { error: "fileId and verificationType required" },
      { status: 400 },
    );
  }

  const metadata = await getFileMetadata(accessToken, fileId);

  if (!ALLOWED_TYPES.includes(metadata.mimeType)) {
    return NextResponse.json(
      { error: "File type not allowed" },
      { status: 400 },
    );
  }

  const size = Number(metadata.size ?? 0);
  const maxSize =
    metadata.mimeType === "application/pdf" ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
  if (size > maxSize) {
    const limit = metadata.mimeType === "application/pdf" ? "5 MB" : "2 MB";
    return NextResponse.json(
      { error: `File exceeds ${limit} limit` },
      { status: 400 },
    );
  }

  const doc = await prisma.verificationDocument.create({
    data: {
      userId: user.id,
      fileId: metadata.id,
      fileName: metadata.name,
      mimeType: metadata.mimeType,
      size,
      verificationType: verificationType.toUpperCase() as VerificationType,
      webViewLink: metadata.webViewLink ?? "",
      webContentLink: metadata.webContentLink ?? "",
    },
  });

  return NextResponse.json({ success: true, document: doc });
}
