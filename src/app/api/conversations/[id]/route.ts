export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { stackServerApp } from "@stack/server";
import { type NextRequest, NextResponse } from "next/server";
import { conversationInclude, getConversationParticipant } from "@/lib/chat";
import { ensureUserInDatabase } from "@/lib/ensureUser";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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

    const participant = await getConversationParticipant(id, stackUser.id);
    if (!participant) {
      return NextResponse.json(
        { error: "You are not a participant of this conversation" },
        { status: 403 },
      );
    }

    const [conversation, unreadRows] = await Promise.all([
      prisma.conversation.findUnique({
        where: { id },
        include: conversationInclude,
      }),
      prisma.message.groupBy({
        by: ["conversationId"],
        where: {
          conversationId: id,
          senderId: { not: stackUser.id },
          readAt: null,
        },
        _count: { _all: true },
      }),
    ]);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const otherParticipant =
      conversation.participants.find((p) => p.userId !== stackUser.id)?.user ??
      null;

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        type: conversation.type,
        property: conversation.property,
        otherParticipant,
        unreadCount: unreadRows[0]?._count._all ?? 0,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to load conversation" },
      { status: 500 },
    );
  }
}
