import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@stack/server";
import {
  getAccessToken,
  uploadFileToDrive,
  makeFilePublic,
} from "@/lib/google-drive";
import { ensureUserInDatabase } from "@/lib/ensureUser";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

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
  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only image files are allowed" },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image must be under 5 MB" },
      { status: 400 },
    );
  }

  const driveFile = await uploadFileToDrive(accessToken, file, {
    name: file.name,
    mimeType: file.type,
  });

  const publicUrl = await makeFilePublic(accessToken, driveFile.id);

  return NextResponse.json({ url: publicUrl });
}
