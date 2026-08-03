export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { stackServerApp } from "@stack/server";
import { type NextRequest, NextResponse } from "next/server";
import { getConversationParticipant, sanitizeMessageContent } from "@/lib/chat";
import { ensureUserInDatabase } from "@/lib/ensureUser";
import prisma from "@/lib/prisma";
import { allow } from "@/lib/rateLimit";
import { publish } from "@/lib/sse";

const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 100;
const MAX_CLIENT_ID_LENGTH = 200;

const messageInclude = {
  sender: {
    select: { id: true, name: true, avatar: true },
  },
} as const;

interface AuthedContext {
  userId: string;
}

async function authenticate(): Promise<
  { ok: true; context: AuthedContext } | { ok: false; response: NextResponse }
> {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  await ensureUserInDatabase({
    id: stackUser.id,
    primaryEmail: stackUser.primaryEmail,
    displayName: stackUser.displayName,
    profileImageUrl: stackUser.profileImageUrl,
  });
  return { ok: true, context: { userId: stackUser.id } };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: conversationId } = await params;

    const auth = await authenticate();
    if (!auth.ok) return auth.response;

    const participant = await getConversationParticipant(
      conversationId,
      auth.context.userId,
    );
    if (!participant) {
      return NextResponse.json(
        { error: "You are not a participant of this conversation" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const before = searchParams.get("before") || undefined;
    const limitRaw = Number.parseInt(
      searchParams.get("limit") || String(DEFAULT_LIMIT),
      10,
    );
    const limit = Math.min(Math.max(limitRaw || DEFAULT_LIMIT, 1), MAX_LIMIT);

    // Newest-first page, then reversed to return oldest→newest for display.
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(before ? { cursor: { id: before }, skip: 1 } : {}),
      include: messageInclude,
    });

    const hasMore = messages.length > limit;
    const page = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore ? messages[limit].id : null;

    return NextResponse.json({
      messages: page.reverse(),
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error listing messages:", error);
    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: conversationId } = await params;

    const auth = await authenticate();
    if (!auth.ok) return auth.response;
    const { userId } = auth.context;

    const participant = await getConversationParticipant(
      conversationId,
      userId,
    );
    if (!participant) {
      return NextResponse.json(
        { error: "You are not a participant of this conversation" },
        { status: 403 },
      );
    }

    // Rate limit message sending (short burst + sustained cap).
    if (!allow(`chat:send:${userId}`, 20, 10_000)) {
      return NextResponse.json(
        { error: "Too many messages. Please slow down." },
        { status: 429 },
      );
    }
    if (!allow(`chat:send:${userId}`, 100, 60_000)) {
      return NextResponse.json(
        { error: "Message limit reached. Try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const content = sanitizeMessageContent(body.content);
    const clientId =
      typeof body.clientId === "string"
        ? body.clientId.trim().slice(0, MAX_CLIENT_ID_LENGTH)
        : null;

    if (!content) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 },
      );
    }

    // Idempotency: if the client retries with the same clientId, return the
    // already-created message instead of creating a duplicate.
    if (clientId) {
      const existing = await prisma.message.findFirst({
        where: { clientId, senderId: userId },
        include: messageInclude,
      });
      if (existing) {
        return NextResponse.json({ message: existing });
      }
    }

    const message = await prisma.$transaction(async (tx) => {
      const created = await tx.message.create({
        data: {
          conversationId,
          senderId: userId,
          content,
          clientId: clientId || null,
        },
        include: messageInclude,
      });
      await tx.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: created.createdAt },
      });
      return created;
    });

    // Fan out to live SSE subscribers of this conversation.
    publish(conversationId, { type: "message", message });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
