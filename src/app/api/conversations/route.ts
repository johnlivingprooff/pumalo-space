export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { stackServerApp } from "@stack/server";
import { type NextRequest, NextResponse } from "next/server";
import {
  getOrCreateDirectConversation,
  participantUserSelect,
} from "@/lib/chat";
import { ensureUserInDatabase } from "@/lib/ensureUser";
import prisma from "@/lib/prisma";
import { allow } from "@/lib/rateLimit";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

interface ConversationListItem {
  id: string;
  type: string;
  property: { id: string; title: string } | null;
  otherParticipant: {
    id: string;
    name: string;
    avatar: string | null;
    verified: boolean;
  } | null;
  lastMessage: { content: string; createdAt: Date; senderId: string } | null;
  unreadCount: number;
  lastMessageAt: Date;
  createdAt: Date;
}

async function getCurrentUser() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) return null;
  await ensureUserInDatabase({
    id: stackUser.id,
    primaryEmail: stackUser.primaryEmail,
    displayName: stackUser.displayName,
    profileImageUrl: stackUser.profileImageUrl,
  });
  return stackUser;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limitRaw = Number.parseInt(
      searchParams.get("limit") || String(DEFAULT_LIMIT),
      10,
    );
    const limit = Math.min(Math.max(limitRaw || DEFAULT_LIMIT, 1), MAX_LIMIT);

    const conversations = await prisma.conversation.findMany({
      where: { participants: { some: { userId: user.id } } },
      orderBy: [{ lastMessageAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        participants: {
          include: { user: { select: participantUserSelect } },
        },
        property: { select: { id: true, title: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    const hasMore = conversations.length > limit;
    const page = hasMore ? conversations.slice(0, limit) : conversations;
    const nextCursor = hasMore ? conversations[limit].id : null;

    const ids = page.map((c) => c.id);
    const unreadRows = ids.length
      ? await prisma.message.groupBy({
          by: ["conversationId"],
          where: {
            conversationId: { in: ids },
            senderId: { not: user.id },
            readAt: null,
          },
          _count: { _all: true },
        })
      : [];
    const unreadMap = new Map(
      unreadRows.map((r) => [r.conversationId, r._count._all]),
    );

    const items: ConversationListItem[] = page.map((conversation) => {
      const other =
        conversation.participants.find((p) => p.userId !== user.id)?.user ??
        null;
      return {
        id: conversation.id,
        type: conversation.type,
        property: conversation.property,
        otherParticipant: other,
        lastMessage: conversation.messages[0] ?? null,
        unreadCount: unreadMap.get(conversation.id) ?? 0,
        lastMessageAt: conversation.lastMessageAt,
        createdAt: conversation.createdAt,
      };
    });

    return NextResponse.json({ conversations: items, nextCursor });
  } catch (error) {
    console.error("Error listing conversations:", error);
    return NextResponse.json(
      { error: "Failed to load conversations" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!allow(`chat:create:${user.id}`, 30, 60_000)) {
      return NextResponse.json(
        { error: "Too many conversations. Please slow down." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const userId = typeof body.userId === "string" ? body.userId.trim() : "";
    const propertyId =
      typeof body.propertyId === "string" && body.propertyId.trim()
        ? body.propertyId.trim()
        : null;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    if (userId === user.id) {
      return NextResponse.json(
        { error: "Cannot start a conversation with yourself" },
        { status: 400 },
      );
    }

    const otherUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isBanned: true },
    });
    if (!otherUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (otherUser.isBanned) {
      return NextResponse.json(
        { error: "This user is not available" },
        { status: 403 },
      );
    }

    if (propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true },
      });
      if (!property) {
        return NextResponse.json(
          { error: "Property not found" },
          { status: 404 },
        );
      }
    }

    const conversation = await getOrCreateDirectConversation(
      user.id,
      userId,
      propertyId,
    );

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to start conversation" },
      { status: 500 },
    );
  }
}
