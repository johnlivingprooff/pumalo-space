import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@stack/server";
import {
  getAccessToken,
  uploadFileToDrive,
  getFileMetadata,
} from "@/lib/google-drive";
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

const MAX_SIZE_GENERAL = 2 * 1024 * 1024; // 2 MB
const MAX_SIZE_PDF = 5 * 1024 * 1024; // 5 MB

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

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const verificationType = formData.get("verificationType") as string | null;

  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!verificationType)
    return NextResponse.json(
      { error: "verificationType required" },
      { status: 400 },
    );

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File type not allowed" },
      { status: 400 },
    );
  }

  const maxSize =
    file.type === "application/pdf" ? MAX_SIZE_PDF : MAX_SIZE_GENERAL;
  if (file.size > maxSize) {
    const limit = file.type === "application/pdf" ? "5 MB" : "2 MB";
    return NextResponse.json(
      { error: `File exceeds ${limit} limit` },
      { status: 400 },
    );
  }

  const driveFile = await uploadFileToDrive(accessToken, file, {
    name: file.name,
    mimeType: file.type,
  });

  const metadata = await getFileMetadata(accessToken, driveFile.id);

  const doc = await prisma.verificationDocument.create({
    data: {
      userId: user.id,
      fileId: metadata.id,
      fileName: metadata.name,
      mimeType: metadata.mimeType,
      size: Number(metadata.size ?? file.size),
      verificationType: verificationType.toUpperCase() as VerificationType,
      webViewLink: metadata.webViewLink ?? "",
      webContentLink: metadata.webContentLink ?? "",
    },
  });

  return NextResponse.json({ success: true, document: doc });
}
