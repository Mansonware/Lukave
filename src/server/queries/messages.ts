import { prisma } from "@/lib/prisma";
import { cache } from "react";

export async function getConversations(userId: string) {
  const members = await prisma.conversationMember.findMany({
    where: { userId },
    include: {
      conversation: {
        include: {
          members: {
            where: { userId: { not: userId } },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      conversation: { updatedAt: "desc" },
    },
  });

  const unreadCounts = await prisma.$queryRaw<{ conversationId: string; unread_count: bigint }[]>`
    SELECT m."conversationId", COUNT(*) as unread_count
    FROM "Message" m
    JOIN "ConversationMember" cm ON cm."conversationId" = m."conversationId"
    WHERE cm."userId" = ${userId}
      AND m."authorId" != ${userId}
      AND (cm."lastReadAt" IS NULL OR m."createdAt" > cm."lastReadAt")
    GROUP BY m."conversationId"
  `;

  const unreadMap = new Map(
    unreadCounts.map((row) => [row.conversationId, Number(row.unread_count)])
  );

  return members.map((m) => {
    const convo = m.conversation;
    const otherMember = convo.members[0]?.user;
    const lastMessage = convo.messages[0];

    return {
      id: convo.id,
      updatedAt: convo.updatedAt,
      otherMember,
      lastMessage,
      unreadCount: unreadMap.get(convo.id) || 0,
    };
  });
}

export const getMessages = cache(async (conversationId: string, userId: string) => {
  // Ensure the user is a member of the conversation
  const member = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
  });

  if (!member) {
    throw new Error("Unauthorized");
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });

  return messages;
});

export async function getOrCreateConversation(userId: string, targetId: string) {
  if (userId === targetId) {
    throw new Error("Cannot start a conversation with yourself");
  }

  // Find existing conversation where both users are members
  const existingConversations = await prisma.conversation.findMany({
    where: {
      AND: [
        { members: { some: { userId: userId } } },
        { members: { some: { userId: targetId } } },
      ],
    },
    include: {
      members: true,
    },
  });

  // Filter out group chats if there were any, though currently we only do 1v1
  const existing = existingConversations.find((c) => c.members.length === 2);

  if (existing) {
    return existing;
  }

  // Create new conversation
  const newConvo = await prisma.conversation.create({
    data: {
      members: {
        create: [
          { userId: userId },
          { userId: targetId },
        ],
      },
    },
  });

  return newConvo;
}
