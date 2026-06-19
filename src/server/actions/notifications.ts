"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/server/action-result";

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { recipientId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/notifications");
  return { ok: true };
}

export async function markNotificationRead(id: string): Promise<ActionResult> {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { id, recipientId: user.id },
    data: { read: true },
  });
  revalidatePath("/notifications");
  return { ok: true };
}

export async function getUnreadCount(): Promise<number> {
  const user = await requireUser();
  return prisma.notification.count({
    where: { recipientId: user.id, read: false },
  });
}
