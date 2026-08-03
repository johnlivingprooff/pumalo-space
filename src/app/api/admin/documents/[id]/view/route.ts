export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { getAccessToken } from "@/lib/google-drive";
import prisma from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  const doc = await prisma.verificationDocument.findUnique({
    where: { id },
    select: { fileId: true, userId: true, fileName: true, mimeType: true },
  });
  if (!doc)
    return NextResponse.json({ error: "Document not found" }, { status: 404 });

  const accessToken = await getAccessToken(doc.userId);
  if (!accessToken)
    return NextResponse.json(
      { error: "Host's Google Drive is no longer connected" },
      { status: 409 },
    );

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${doc.fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!response.ok)
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: response.status },
    );

  const contentType = doc.mimeType || "application/octet-stream";
  const safeName = doc.fileName.replace(/[^\w.-]/g, "_");

  return new Response(response.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${safeName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
