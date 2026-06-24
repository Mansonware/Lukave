"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { limiters, rateLimit } from "@/lib/rate-limit";
import { createPostSchema, createCommentSchema } from "@/lib/validations";
import { authAction } from "@/lib/action-wrapper";
import { cache } from "react";

export const createPost = authAction(
  createPostSchema,
  async ({ content, mediaUrls, visibility }, { user }) => {
    const rl = await rateLimit(limiters.createPost, user.id);
    if (!rl.ok) return rl;

    const safeMediaUrls = mediaUrls || [];
    if (!content?.trim() && safeMediaUrls.length === 0) {
      return { ok: false, error: "Escreva algo ou adicione uma imagem." };
    }

    const post = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const created = await tx.post.create({
        data: {
          authorId: user.id,
          content: content?.trim() || "",
          visibility,
          media: {
            create: safeMediaUrls.map((url, i) => ({
              url,
              type: "IMAGE" as const,
              order: i,
            })),
          },
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { postsCount: { increment: 1 } },
      });

      return created;
    });

    revalidatePath("/feed");
    revalidatePath(`/${user.username}`);
    return { ok: true, data: { id: post.id } };
  }
);

export const deletePost = authAction(
  z.string(),
  async (postId, { user }) => {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return { ok: false, error: "Publicação não encontrada." };
    if (post.authorId !== user.id && user.role !== "ADMIN") {
      return { ok: false, error: "Sem permissão." };
    }

    await prisma.$transaction([
      prisma.post.delete({ where: { id: postId } }),
      prisma.user.update({
        where: { id: post.authorId },
        data: { postsCount: { decrement: 1 } },
      }),
    ]);

    revalidatePath("/feed");
    return { ok: true };
  }
);

export const toggleLike = authAction(
  z.string(),
  async (postId, { user }) => {
    const rl = await rateLimit(limiters.toggleLike, user.id);
    if (!rl.ok) return rl;

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId: user.id, postId } },
    });

    let liked: boolean;

    if (existing) {
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existing.id } }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);
      liked = false;
    } else {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      });
      if (!post) return { ok: false, error: "Publicação não encontrada." };

      await prisma.$transaction([
        prisma.like.create({ data: { userId: user.id, postId } }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);

      if (post.authorId !== user.id) {
        await prisma.notification.create({
          data: {
            type: "LIKE",
            recipientId: post.authorId,
            actorId: user.id,
            postId,
          },
        });
      }
      liked = true;
    }

    const updated = await prisma.post.findUnique({
      where: { id: postId },
      select: { likesCount: true },
    });

    revalidatePath("/feed");
    return { ok: true, data: { liked, likesCount: updated?.likesCount ?? 0 } };
  }
);

export const addComment = authAction(
  createCommentSchema,
  async ({ postId, content }, { user }) => {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) return { ok: false, error: "Publicação não encontrada." };

    const comment = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const created = await tx.comment.create({
        data: { postId, authorId: user.id, content: content.trim() },
      });
      await tx.post.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } },
      });
      return created;
    });

    if (post.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          type: "COMMENT",
          recipientId: post.authorId,
          actorId: user.id,
          postId,
        },
      });
    }

    revalidatePath("/feed");
    revalidatePath(`/post/${postId}`);
    return { ok: true, data: { id: comment.id } };
  }
);

export const getComments = cache(async (postId: string) => {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: { id: true, name: true, username: true, image: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    author: c.author,
  }));
});

export const sharePost = authAction(
  z.string(),
  async (postId, { user }) => {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) return { ok: false, error: "Publicação não encontrada." };

    const existing = await prisma.share.findUnique({
      where: { userId_postId: { userId: user.id, postId } },
    });

    let shared: boolean;
    if (existing) {
      await prisma.$transaction([
        prisma.share.delete({ where: { id: existing.id } }),
        prisma.post.update({
          where: { id: postId },
          data: { sharesCount: { decrement: 1 } },
        }),
      ]);
      shared = false;
    } else {
      await prisma.$transaction([
        prisma.share.create({ data: { userId: user.id, postId } }),
        prisma.post.update({
          where: { id: postId },
          data: { sharesCount: { increment: 1 } },
        }),
      ]);
      shared = true;
    }

    const updated = await prisma.post.findUnique({
      where: { id: postId },
      select: { sharesCount: true },
    });

    revalidatePath("/feed");
    return { ok: true, data: { shared, sharesCount: updated?.sharesCount ?? 0 } };
  }
);
