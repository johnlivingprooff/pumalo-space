export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { stackServerApp } from "@stack/server";
import { type NextRequest, NextResponse } from "next/server";
import { getConversationParticipant } from "@/lib/chat";
import { subscribe } from "@/lib/sse";

const HEARTBEAT_INTERVAL_MS = 25_000;

/**
 * Server-Sent Events stream for a conversation.
 *
 * The client connects with EventSource (same-origin, so Stack Auth cookies
 * are sent automatically). The stream stays open and receives new messages
 * published to the conversation channel by POST /messages.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: conversationId } = await params;

  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const enqueue = (payload: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch {
          // Stream already closed.
        }
      };

      enqueue(JSON.stringify({ type: "connected" }));

      const unsubscribe = subscribe(conversationId, enqueue);
      const heartbeat = setInterval(() => {
        enqueue(JSON.stringify({ type: "ping" }));
      }, HEARTBEAT_INTERVAL_MS);

      request.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed.
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
