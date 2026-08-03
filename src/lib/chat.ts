import prisma from "@/lib/prisma";

/** Maximum length of a single chat message body. */
export const MAX_MESSAGE_LENGTH = 4000;

/** Public profile fields exposed for conversation participants. */
export const participantUserSelect = {
  id: true,
  name: true,
  avatar: true,
  verified: true,
} as const;

export interface ConversationInclude {
  participants: {
    include: { user: { select: typeof participantUserSelect } };
  };
  property: {
    select: { id: true; title: true };
  };
}

export const conversationInclude = {
  participants: {
    include: { user: { select: participantUserSelect } },
  },
  property: {
    select: { id: true, title: true },
  },
} satisfies ConversationInclude;

/**
 * Normalizes message content for storage.
 * - Coerces non-string input to empty string
 * - Strips control characters (allows \n line breaks)
 * - Trims surrounding whitespace
 * - Enforces a hard length cap (slider values are stored/rendered as plain
 *   text; React escapes HTML on output, so no markup is executed)
 */
export function sanitizeMessageContent(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const cleaned = Array.from(raw)
    .filter((char) => {
      const code = char.codePointAt(0) ?? 0;
      const isControl =
        code <= 0x08 ||
        code === 0x0b ||
        code === 0x0c ||
        (code >= 0x0e && code <= 0x1f) ||
        code === 0x7f;
      return !isControl;
    })
    .join("")
    .trim();
  return cleaned.slice(0, MAX_MESSAGE_LENGTH);
}

/**
 * Finds an existing 1:1 conversation between two users, or creates one.
 * Optionally scopes to a property so listing chats stay in their own thread.
 *
 * Note: concurrent first-messages could theoretically race and create
 * duplicates. For a stronger guarantee add a unique index on the sorted
 * participant pair at the DB level.
 */
export async function getOrCreateDirectConversation(
  userA: string,
  userB: string,
  propertyId?: string | null,
) {
  const existing = await prisma.conversation.findFirst({
    where: {
      type: "DIRECT",
      propertyId: propertyId ?? null,
      AND: [
        { participants: { some: { userId: userA } } },
        { participants: { some: { userId: userB } } },
      ],
    },
    include: conversationInclude,
  });
  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      type: "DIRECT",
      propertyId: propertyId ?? null,
      participants: {
        create: [{ userId: userA }, { userId: userB }],
      },
    },
    include: conversationInclude,
  });
}

/** Verifies a user belongs to a conversation. Returns the participant row. */
export async function getConversationParticipant(
  conversationId: string,
  userId: string,
) {
  return prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId },
    },
  });
}
