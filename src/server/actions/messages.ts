"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/server/action-result";
import { getOrCreateConversation, getMessages } from "@/server/queries/messages";

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  if (!content.trim()) {
    return { ok: false, error: "Mensagem vazia." };
  }

  // Ensure user is member
  const member = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: user.id },
    },
  });

  if (!member) {
    return { ok: false, error: "Não autorizado." };
  }

  const message = await prisma.$transaction(async (tx) => {
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

export async function markConversationRead(
  conversationId: string
): Promise<ActionResult> {
  const user = await requireUser();

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

export async function fetchMessages(conversationId: string) {
  const user = await requireUser();
  return getMessages(conversationId, user.id);
}


export async function startConversation(
  targetUserId: string
): Promise<ActionResult<{ conversationId: string }>> {
  const user = await requireUser();

  try {
    const convo = await getOrCreateConversation(user.id, targetUserId);
    revalidatePath("/messages");
    return { ok: true, data: { conversationId: convo.id } };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao criar conversa.";
    return { ok: false, error: message };
  }
}
