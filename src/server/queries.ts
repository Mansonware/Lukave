import { prisma } from "@/lib/prisma";
import { cache } from "react";
import type { Prisma } from "@prisma/client";

/** Seleção padrão de autor para cards de post/comentário. */
const authorSelect = {
  id: true,
  name: true,
  username: true,
  image: true,
  role: true,
};



export type FeedPost = Awaited<ReturnType<typeof getFeedPosts>>[number];

export const getFeedPosts = cache(async (opts: {
  viewerId?: string;
  authorId?: string;
  cursor?: string;
  take?: number;
}) => {
  const { viewerId, authorId, cursor, take = 20 } = opts;

  const rows = await prisma.post.findMany({
    where: {
      visibility: "PUBLIC",
      ...(authorId ? { authorId } : {}),
    },
    include: {
      author: { select: authorSelect },
      media: { orderBy: { order: "asc" as const } },
      ...(viewerId ? { likes: { where: { userId: viewerId }, select: { id: true } } } : {}),
      ...(viewerId ? { shares: { where: { userId: viewerId }, select: { id: true } } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = rows.length > take;
  const items = hasMore ? rows.slice(0, take) : rows;

  return items.map((p) => ({
    ...p,
    likedByMe: Array.isArray(p.likes) ? p.likes.length > 0 : false,
    sharedByMe: Array.isArray(p.shares) ? p.shares.length > 0 : false,
    nextCursor: hasMore ? items[items.length - 1]?.id : null,
  }));
});

export const getPostById = cache(async (id: string, viewerId?: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: authorSelect },
      media: { orderBy: { order: "asc" as const } },
      ...(viewerId ? { likes: { where: { userId: viewerId }, select: { id: true } } } : {}),
      ...(viewerId ? { shares: { where: { userId: viewerId }, select: { id: true } } } : {}),
      comments: {
        include: { author: { select: authorSelect } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!post) return null;
  return {
    ...post,
    likedByMe: Array.isArray(post.likes) ? post.likes.length > 0 : false,
    sharedByMe: Array.isArray(post.shares) ? post.shares.length > 0 : false,
  };
});

export const getProfileByUsername = cache(async (username: string, viewerId?: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bannerUrl: true,
      bio: true,
      location: true,
      websiteUrl: true,
      socialLinks: true,
      role: true,
      followersCount: true,
      followingCount: true,
      postsCount: true,
      createdAt: true,
    },
  });
  if (!user) return null;

  let isFollowing = false;
  if (viewerId && viewerId !== user.id) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: viewerId,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  return { ...user, isFollowing, isMe: viewerId === user.id };
});

export const searchAll = cache(async (query: string, viewerId?: string) => {
  const q = query.trim();
  if (!q) return { users: [], posts: [] };

  const [users, posts] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        followersCount: true,
        role: true,
      },
      take: 12,
    }),
    prisma.post.findMany({
      where: {
        visibility: "PUBLIC",
        content: { contains: q, mode: "insensitive" },
      },
      include: {
        author: { select: authorSelect },
        media: { orderBy: { order: "asc" as const } },
        ...(viewerId ? { likes: { where: { userId: viewerId }, select: { id: true } } } : {}),
        ...(viewerId ? { shares: { where: { userId: viewerId }, select: { id: true } } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return {
    users,
    posts: posts.map((p) => ({
      ...p,
      likedByMe: Array.isArray(p.likes) ? p.likes.length > 0 : false,
      sharedByMe: Array.isArray(p.shares) ? p.shares.length > 0 : false,
    })),
  };
});

export const getNotifications = cache(async (userId: string) => {
  return prisma.notification.findMany({
    where: { recipientId: userId },
    include: {
      actor: { select: authorSelect },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
});

export const getSuggestedUsers = cache(async (viewerId?: string, take = 5) => {
  return prisma.user.findMany({
    where: viewerId
      ? {
          id: { not: viewerId },
          followers: { none: { followerId: viewerId } },
        }
      : {},
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      followersCount: true,
      role: true,
    },
    orderBy: { followersCount: "desc" },
    take,
  });
});
