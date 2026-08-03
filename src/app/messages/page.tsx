"use client";

import { useUser } from "@stackframe/stack";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
  lastMessage: {
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
}

const POLL_INTERVAL_MS = 30_000;

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function MessagesInboxPage() {
  const user = useUser();
  const [conversations, setConversations] = useState<
    ConversationListItem[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load conversations");
      }
      const data = await res.json();
      setConversations(data.conversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [user?.id, load]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Sign in to view your messages
            </h1>
            <p className="text-gray-600 mb-6">
              Log in to see your conversations with hosts and guests.
            </p>
            <Link
              href="/sign-in"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">
            Your conversations with hosts and guests
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {conversations === null && !error ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : conversations?.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>No messages</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No messages yet
            </h3>
            <p className="text-gray-600 mb-6">
              Contact a host from any property to start a conversation
            </p>
            <Link
              href="/properties"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
            {conversations?.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold overflow-hidden">
                    <Image
                      src={conversation.otherParticipant?.avatar || "/user.svg"}
                      alt={conversation.otherParticipant?.name || "User"}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                      {conversation.unreadCount > 99
                        ? "99+"
                        : conversation.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-gray-900 truncate">
                      {conversation.otherParticipant?.name || "User"}
                    </p>
                    {conversation.lastMessage && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {conversation.property && (
                    <p className="text-xs text-primary-600 truncate">
                      {conversation.property.title}
                    </p>
                  )}
                  <p
                    className={`text-sm truncate ${
                      conversation.unreadCount > 0
                        ? "text-gray-900 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {conversation.lastMessage?.content || "Say hello"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
