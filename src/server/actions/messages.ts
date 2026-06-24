"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authAction, noArgsAuthAction } from "@/lib/action-wrapper";
import { getOrCreateConversation, getMessages } from "@/server/queries/messages";

export const sendMessage = authAction(
  z.object({ conversationId: z.string(), content: z.string().min(1, "Mensagem vazia.") }),
  async ({ conversationId, content }, { user }) => {
    // Ensure user is member
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: { conversationId, userId: user.id },
      },
    });

    if (!member) {
      return { ok: false, error: "Não autorizado." };
    }

    const message = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const created = await tx.message.create({
        data: {
          conversationId,
          authorId: user.id,
          content: content.trim(),
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return created;
    });

    revalidatePath(`/messages/${conversationId}`);
    revalidatePath("/messages");

    return { ok: true, data: { id: message.id } };
  }
);

export const markConversationRead = authAction(
  z.object({ conversationId: z.string() }),
  async ({ conversationId }, { user }) => {
    await prisma.conversationMember.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.id,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    revalidatePath("/messages");
    return { ok: true };
  }
);

export const fetchMessages = authAction(
  z.object({ conversationId: z.string() }),
  async ({ conversationId }, { user }) => {
    const data = await getMessages(conversationId, user.id);
    return { ok: true, data };
  }
);

export const startConversation = authAction(
  z.object({ targetUserId: z.string() }),
  async ({ targetUserId }, { user }) => {
    const convo = await getOrCreateConversation(user.id, targetUserId);
    revalidatePath("/messages");
    return { ok: true, data: { conversationId: convo.id } };
  }
);
