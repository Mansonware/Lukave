import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { requireUser } from "@/lib/session";
import { getMessages } from "@/server/queries/messages";
import { prisma } from "@/lib/prisma";
import { ChatClient } from "./chat-client";

export const metadata: Metadata = { title: "Conversa" };

export default async function MessageConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  // Verify membership and get the other member
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      members: {
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
    },
  });

  if (!conversation) return notFound();

  const isMember = conversation.members.some((m) => m.userId === user.id);
  if (!isMember) return notFound();

  const otherMember = conversation.members.find((m) => m.userId !== user.id)?.user || null;

  const messages = await getMessages(id, user.id);

  return (
    <ChatClient
      initialMessages={messages}
      conversationId={id}
      currentUserId={user.id}
      otherMember={otherMember}
    />
  );
}
