export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { stackServerApp } from "@stack/server";
import { type NextRequest, NextResponse } from "next/server";
import { getConversationParticipant } from "@/lib/chat";
import { ensureUserInDatabase } from "@/lib/ensureUser";
import prisma from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: conversationId } = await params;

    const stackUser = await stackServerApp.getUser();
    if (!stackUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await ensureUserInDatabase({
      id: stackUser.id,
      primaryEmail: stackUser.primaryEmail,
      displayName: stackUser.displayName,
      profileImageUrl: stackUser.profileImageUrl,
    });

    const participant = await getConversationParticipant(
      conversationId,
      stackUser.id,
    );
    if (!participant) {
      return NextResponse.json(
        { error: "You are not a participant of this conversation" },
        { status: 403 },
      );
    }

    // Mark every inbound message as read up to this point.
    const result = await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: stackUser.id },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    return NextResponse.json(
      { error: "Failed to mark conversation as read" },
      { status: 500 },
    );
  }
}
