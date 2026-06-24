"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { limiters, rateLimit } from "@/lib/rate-limit";
import { requireUser } from "@/lib/session";
import { createStorySchema } from "@/lib/validations";
import { authAction } from "@/lib/action-wrapper";
import type { StoryGroup, StoryMediaType } from "@/types/story";
import { cache } from "react";

const STORY_DURATION_MS = 24 * 60 * 60 * 1000;

export const createStory = authAction(
  createStorySchema,
  async ({ mediaUrl, mediaType }, { user }) => {
    const rl = await rateLimit(limiters.createStory, user.id);
    if (!rl.ok) return rl;

    const expiresAt = new Date(Date.now() + STORY_DURATION_MS);
    const story = await prisma.story.create({
      data: {
        authorId: user.id,
        mediaUrl,
        mediaType: mediaType || "IMAGE",
        expiresAt,
      },
    });

    revalidatePath("/feed");
    revalidatePath(`/${user.username}`);

    return {
      ok: true,
      data: {
        id: story.id,
        expiresAt: story.expiresAt,
      },
    };
  }
);

export const getActiveStories = cache(async (): Promise<StoryGroup[]> => {
  const user = await requireUser();
  const now = new Date();

  const stories = await prisma.story.findMany({
    where: {
      expiresAt: {
        gt: now,
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  const grouped = new Map<string, StoryGroup>();

  for (const story of stories) {
    const existing = grouped.get(story.authorId);

    if (existing) {
      existing.stories.push({
        id: story.id,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType as StoryMediaType,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
      });

      if (story.createdAt > existing.latestCreatedAt) {
        existing.latestCreatedAt = story.createdAt;
      }
      continue;
    }

    grouped.set(story.authorId, {
      author: story.author,
      stories: [
        {
          id: story.id,
          mediaUrl: story.mediaUrl,
          mediaType: story.mediaType as StoryMediaType,
          createdAt: story.createdAt,
          expiresAt: story.expiresAt,
        },
      ],
      latestCreatedAt: story.createdAt,
      isOwn: story.authorId === user.id,
    });
  }

  return Array.from(grouped.values())
    .map((group) => ({
      ...group,
      stories: [...group.stories].sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      ),
    }))
    .sort((a, b) => {
      if (a.isOwn !== b.isOwn) return a.isOwn ? -1 : 1;
      return b.latestCreatedAt.getTime() - a.latestCreatedAt.getTime();
    });
});
