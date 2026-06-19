"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/server/actions/auth";

export async function toggleFollow(
  targetUserId: string,
): Promise<ActionResult<{ following: boolean }>> {
  const user = await requireUser();

  if (user.id === targetUserId) {
    return { ok: false, error: "Você não pode seguir a si mesmo." };
  }

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, username: true },
  });
  if (!target) return { ok: false, error: "Usuário não encontrado." };

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId: targetUserId,
      },
    },
  });

  let following: boolean;

  if (existing) {
    await prisma.$transaction([
      prisma.follow.delete({ where: { id: existing.id } }),
      prisma.user.update({
        where: { id: user.id },
        data: { followingCount: { decrement: 1 } },
      }),
      prisma.user.update({
        where: { id: targetUserId },
        data: { followersCount: { decrement: 1 } },
      }),
    ]);
    following = false;
  } else {
    await prisma.$transaction([
      prisma.follow.create({
        data: { followerId: user.id, followingId: targetUserId },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { followingCount: { increment: 1 } },
      }),
      prisma.user.update({
        where: { id: targetUserId },
        data: { followersCount: { increment: 1 } },
      }),
    ]);
    await prisma.notification.create({
      data: {
        type: "FOLLOW",
        recipientId: targetUserId,
        actorId: user.id,
      },
    });
    following = true;
  }

  revalidatePath(`/${target.username}`);
  revalidatePath("/feed");
  return { ok: true, data: { following } };
}
