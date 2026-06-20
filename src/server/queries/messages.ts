import { prisma } from "@/lib/prisma";

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

  const enriched = await Promise.all(
    members.map(async (m) => {
      const convo = m.conversation;
      const otherMember = convo.members[0]?.user;
      const lastMessage = convo.messages[0];

      let unreadCount = 0;
      if (m.lastReadAt) {
        unreadCount = await prisma.message.count({
          where: {
            conversationId: convo.id,
            authorId: { not: userId },
            createdAt: { gt: m.lastReadAt },
          },
        });
      } else {
        unreadCount = await prisma.message.count({
          where: {
            conversationId: convo.id,
            authorId: { not: userId },
          },
        });
      }

      return {
        id: convo.id,
        updatedAt: convo.updatedAt,
        otherMember,
        lastMessage,
        unreadCount,
      };
    })
  );

  return enriched;
}

export async function getMessages(conversationId: string, userId: string) {
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
}

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
