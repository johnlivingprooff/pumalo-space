import { prisma } from "./prisma";

const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_DRIVE_API = "https://www.googleapis.com/drive/v3";
const GOOGLE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";

const SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/drive.file",
];

export function getAuthUrl(userId: string, next = "/"): string {
  const state = JSON.stringify({ userId, next });
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_DRIVE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_DRIVE_REDIRECT_URI!,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${GOOGLE_OAUTH_URL}?${params}`;
}

export async function exchangeCodeForTokens(code: string, userId: string) {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_DRIVE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_DRIVE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) throw new Error("Failed to exchange code");

  const data = await response.json();
  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  await prisma.googleDriveToken.upsert({
    where: { userId },
    create: {
      userId,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
    },
    update: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
    },
  });

  return data.access_token;
}

export async function getAccessToken(userId: string): Promise<string | null> {
  const token = await prisma.googleDriveToken.findUnique({ where: { userId } });
  if (!token) return null;

  if (token.expiresAt > new Date()) return token.accessToken;

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_DRIVE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
      refresh_token: token.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  await prisma.googleDriveToken.update({
    where: { userId },
    data: { accessToken: data.access_token, expiresAt },
  });

  return data.access_token;
}

export async function uploadFileToDrive(
  accessToken: string,
  file: File,
  metadata: { name: string; mimeType: string },
) {
  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const fileBuffer = await file.arrayBuffer();
  const metadataBody = JSON.stringify(metadata);

  const multipartBody = [
    delimiter,
    "Content-Type: application/json; charset=UTF-8\r\n\r\n",
    metadataBody,
    delimiter,
    `Content-Type: ${file.type}\r\n\r\n`,
    new Uint8Array(fileBuffer),
    closeDelimiter,
  ];

  const body = new Blob(multipartBody);

  const response = await fetch(
    `${GOOGLE_UPLOAD_API}/files?uploadType=multipart`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    },
  );

  if (!response.ok) throw new Error("Upload failed");
  return response.json();
}

export async function getFileMetadata(accessToken: string, fileId: string) {
  const response = await fetch(
    `${GOOGLE_DRIVE_API}/files/${fileId}?fields=id,name,mimeType,size,webViewLink,webContentLink`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) throw new Error("Failed to get file metadata");
  return response.json();
}

export async function makeFilePublic(accessToken: string, fileId: string) {
  await fetch(`${GOOGLE_DRIVE_API}/files/${fileId}/permissions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role: "reader", type: "anyone" }),
  });
  // Return a stable direct-view URL that works without auth
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export async function revokeAccess(userId: string) {
  const token = await prisma.googleDriveToken.findUnique({ where: { userId } });
  if (!token) return;

  await fetch(
    `https://oauth2.googleapis.com/revoke?token=${token.accessToken}`,
    {
      method: "POST",
    },
  );

  await prisma.googleDriveToken.delete({ where: { userId } });
}
