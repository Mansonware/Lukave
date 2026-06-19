"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { createPostSchema, createCommentSchema } from "@/lib/validations";
import type { ActionResult } from "@/server/action-result";

export async function createPost(input: {
  content: string;
  mediaUrls?: string[];
  visibility?: "PUBLIC" | "FOLLOWERS" | "PRIVATE";
}): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsed = createPostSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Publicação inválida." };
  }
  const { content, mediaUrls, visibility } = parsed.data;

  if (!content.trim() && mediaUrls.length === 0) {
    return { ok: false, error: "Escreva algo ou adicione uma imagem." };
  }

  const post = await prisma.$transaction(async (tx) => {
    const created = await tx.post.create({
      data: {
        authorId: user.id,
        content: content.trim(),
        visibility,
        media: {
          create: mediaUrls.map((url, i) => ({
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

export async function deletePost(postId: string): Promise<ActionResult> {
  const user = await requireUser();
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

export async function toggleLike(
  postId: string,
): Promise<ActionResult<{ liked: boolean; likesCount: number }>> {
  const user = await requireUser();

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

export async function addComment(input: {
  postId: string;
  content: string;
}): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsed = createCommentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Comentário inválido." };
  }
  const { postId, content } = parsed.data;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });
  if (!post) return { ok: false, error: "Publicação não encontrada." };

  const comment = await prisma.$transaction(async (tx) => {
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

export async function getComments(postId: string) {
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
}

export async function sharePost(
  postId: string,
): Promise<ActionResult<{ shared: boolean; sharesCount: number }>> {
  const user = await requireUser();

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
