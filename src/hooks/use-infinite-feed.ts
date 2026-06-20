"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { PostCardData } from "@/types/post";

interface FeedResponse {
  posts: PostCardData[];
  nextCursor: string | null;
}

const PRELOAD_ROOT_MARGIN = "250px 0px";

export function useInfiniteFeed({
  initialPosts,
  initialCursor,
}: {
  initialPosts: PostCardData[];
  initialCursor: string | null;
}) {
  const [posts, setPosts] = useState<PostCardData[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(Boolean(initialCursor));
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ cursor });
      const response = await fetch(`/api/feed?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Falha ao carregar feed.");
      }

      const data = (await response.json()) as FeedResponse;
      const nextCursor = data.nextCursor;
      const canContinue = Boolean(nextCursor) && nextCursor !== cursor;

      setPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post.id));
        const incoming = data.posts.filter((post) => !existingIds.has(post.id));
        if (incoming.length === 0) {
          setHasMore(false);
          return prev;
        }
        return [...prev, ...incoming];
      });

      setCursor(nextCursor);
      setHasMore(canContinue);
    } catch {
      setError("Não foi possível carregar mais publicações.");
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      {
        rootMargin: PRELOAD_ROOT_MARGIN,
        threshold: 0.1,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return {
    posts,
    loading,
    error,
    hasMore,
    sentinelRef,
    loadMore,
  };
}
