import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/** Seleção padrão de autor para cards de post/comentário. */
const authorSelect = {
  id: true,
  name: true,
  username: true,
  image: true,
  role: true,
} satisfies Prisma.UserSelect;

/** Inclui dados do post + relações do viewer (curtido/compartilhado por mim). */
function postInclude(viewerId?: string) {
  return {
    author: { select: authorSelect },
    media: { orderBy: { order: "asc" } },
    likes: viewerId ? { where: { userId: viewerId }, select: { id: true } } : false,
    shares: viewerId ? { where: { userId: viewerId }, select: { id: true } } : false,
  } satisfies Prisma.PostInclude;
}

export type FeedPost = Awaited<ReturnType<typeof getFeedPosts>>[number];

export async function getFeedPosts(opts: {
  viewerId?: string;
  authorId?: string;
  cursor?: string;
  take?: number;
}) {
  const { viewerId, authorId, cursor, take = 20 } = opts;

  const rows = await prisma.post.findMany({
    where: {
      visibility: "PUBLIC",
      ...(authorId ? { authorId } : {}),
    },
    include: postInclude(viewerId),
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
}

export async function getPostById(id: string, viewerId?: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      ...postInclude(viewerId),
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
}

export async function getProfileByUsername(username: string, viewerId?: string) {
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
}

export async function searchAll(query: string, viewerId?: string) {
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
      include: postInclude(viewerId),
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
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { recipientId: userId },
    include: {
      actor: { select: authorSelect },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getSuggestedUsers(viewerId?: string, take = 5) {
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
}

// ── Marketplace ──────────────────────────────────────────────────

export async function getPublishedProducts(opts: {
  creatorId?: string;
  type?: string;
  cursor?: string;
  take?: number;
}) {
  const { creatorId, type, cursor, take = 24 } = opts;

  const rows = await prisma.product.findMany({
    where: {
      published: true,
      ...(creatorId ? { creatorId } : {}),
      ...(type ? { type: type as never } : {}),
    },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      priceCents: true,
      currency: true,
      coverUrl: true,
      createdAt: true,
      creator: { select: { id: true, name: true, username: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = rows.length > take;
  const items = hasMore ? rows.slice(0, take) : rows;
  return { items, nextCursor: hasMore ? items[items.length - 1]?.id : null };
}

export async function getProductById(id: string, viewerId?: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, username: true, image: true } },
    },
  });
  if (!product) return null;

  let ownedByViewer = false;
  if (viewerId) {
    const item = await prisma.libraryItem.findUnique({
      where: { userId_productId: { userId: viewerId, productId: id } },
    });
    ownedByViewer = !!item;
  }

  return { ...product, ownedByViewer };
}

export async function getUserLibrary(userId: string, cursor?: string, take = 24) {
  const rows = await prisma.libraryItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          type: true,
          coverUrl: true,
          fileUrl: true,
          creator: { select: { id: true, name: true, username: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = rows.length > take;
  const items = hasMore ? rows.slice(0, take) : rows;
  return { items, nextCursor: hasMore ? items[items.length - 1]?.id : null };
}
