"use client";

import { useUser } from "@stackframe/stack";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
  sender: { id: string; name: string; avatar: string | null };
}

interface ConversationMeta {
  id: string;
  property: { id: string; title: string } | null;
  otherParticipant: {
    id: string;
    name: string;
    avatar: string | null;
    verified: boolean;
  } | null;
  unreadCount: number;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageThreadPage() {
  const params = useParams();
  const user = useUser();
  const conversationId = params.id as string;

  const [conversation, setConversation] = useState<ConversationMeta | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) =>
      prev.some((m) => m.id === message.id) ? prev : [...prev, message],
    );
  }, []);

  const markRead = useCallback(async () => {
    if (!conversationId) return;
    try {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: "POST",
      });
    } catch {
      // Best-effort read receipt.
    }
  }, [conversationId]);

  // Load conversation meta + initial message page.
  useEffect(() => {
    if (!conversationId || !user?.id) return;

    const load = async () => {
      try {
        const [metaRes, msgsRes] = await Promise.all([
          fetch(`/api/conversations/${conversationId}`),
          fetch(`/api/conversations/${conversationId}/messages?limit=30`),
        ]);

        if (!metaRes.ok || !msgsRes.ok) {
          const data = await (metaRes.ok ? msgsRes : metaRes).json();
          throw new Error(data.error || "Failed to load conversation");
        }

        const meta = (await metaRes.json()).conversation as ConversationMeta;
        const msgs = (await msgsRes.json()) as {
          messages: Message[];
          nextCursor: string | null;
          hasMore: boolean;
        };

        setConversation(meta);
        setMessages(msgs.messages);
        setNextCursor(msgs.nextCursor);
        setHasMore(msgs.hasMore);
        await markRead();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [conversationId, user?.id, markRead]);

  // Live updates via Server-Sent Events.
  useEffect(() => {
    if (!conversationId || !user?.id) return;

    const es = new EventSource(`/api/conversations/${conversationId}/stream`);
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as {
          type: string;
          message?: Message;
        };
        if (data.type === "message" && data.message) {
          addMessage(data.message);
          if (data.message.senderId !== user.id) markRead();
        }
      } catch {
        // Ignore malformed events.
      }
    };
    // EventSource reconnects automatically on network errors.

    return () => es.close();
  }, [conversationId, user?.id, addMessage, markRead]);

  // Auto-scroll to the newest message.
  useEffect(() => {
    if (messages.length === 0) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const loadOlder = async () => {
    if (!nextCursor) return;
    try {
      const res = await fetch(
        `/api/conversations/${conversationId}/messages?before=${nextCursor}&limit=30`,
      );
      if (!res.ok) return;
      const data = (await res.json()) as {
        messages: Message[];
        nextCursor: string | null;
        hasMore: boolean;
      };
      setMessages((prev) => [...data.messages, ...prev]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch {
      // Keep current state on failure.
    }
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending || !user?.id) return;

    setSending(true);
    setError(null);
    const clientId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : undefined;

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, clientId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }
      const data = (await res.json()) as { message: Message };
      addMessage(data.message);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const isMe = (message: Message) => message.senderId === user?.id;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link
            href="/messages"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to messages"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Back to messages</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold overflow-hidden flex-shrink-0">
            <Image
              src={conversation?.otherParticipant?.avatar || "/user.svg"}
              alt={conversation?.otherParticipant?.name || "User"}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-gray-900 truncate">
              {conversation?.otherParticipant?.name || "Conversation"}
            </h1>
            {conversation?.property && (
              <p className="text-xs text-gray-500 truncate">
                {conversation.property.title}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-3xl w-full mx-auto mt-4 px-4 sm:px-6 lg:px-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-3">
            {hasMore && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={loadOlder}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Load older messages
                </button>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${isMe(message) ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                    isMe(message)
                      ? "bg-primary-600 text-white rounded-br-sm"
                      : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMe(message) ? "text-primary-100" : "text-gray-400"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                    {isMe(message) && message.readAt && " · Read"}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-end gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Write a message..."
            className="flex-1 resize-none px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 placeholder:text-gray-400 max-h-32"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
