"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { noArgsAuthAction, authAction } from "@/lib/action-wrapper";
import { z } from "zod";
import { requireUser } from "@/lib/session";

export const markAllNotificationsRead = noArgsAuthAction(async ({ user }) => {
  await prisma.notification.updateMany({
    where: { recipientId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/notifications");
  return { ok: true };
});

export const markNotificationRead = authAction(
  z.object({ id: z.string() }),
  async ({ id }, { user }) => {
    await prisma.notification.updateMany({
      where: { id, recipientId: user.id },
      data: { read: true },
    });
    revalidatePath("/notifications");
    return { ok: true };
  }
);

export async function getUnreadCount(): Promise<number> {
  const user = await requireUser();
  return prisma.notification.count({
    where: { recipientId: user.id, read: false },
  });
}
