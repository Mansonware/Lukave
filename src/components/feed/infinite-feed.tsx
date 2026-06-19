"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/feed/post-card";
import type { PostCardData, Viewer } from "@/types/post";

interface FeedPostData extends PostCardData {
  nextCursor: string | null;
}

interface FeedResponse {
  posts: FeedPostData[];
  nextCursor: string | null;
}

export function InfiniteFeed({
  initialPosts,
  viewer,
}: {
  initialPosts: FeedPostData[];
  viewer: Viewer;
}) {
  const [posts, setPosts] = useState<FeedPostData[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(
    initialPosts[initialPosts.length - 1]?.nextCursor ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(
    Boolean(initialPosts[initialPosts.length - 1]?.nextCursor),
  );
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

      setPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post.id));
        const incoming = data.posts.filter((post) => !existingIds.has(post.id));
        if (incoming.length === 0) {
          setHasMore(false);
          return prev;
        }
        return [...prev, ...incoming];
      });

      setCursor(data.nextCursor);
      setHasMore(Boolean(data.nextCursor) && data.nextCursor !== cursor);
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
        root: null,
        rootMargin: "250px 0px",
        threshold: 0.1,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const mappedPosts = useMemo(
    () =>
      posts.map((post) => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        sharesCount: post.sharesCount,
        author: post.author,
        media: post.media,
        likedByMe: post.likedByMe,
        sharedByMe: post.sharedByMe,
      })),
    [posts],
  );

  return (
    <div>
      {mappedPosts.map((post) => (
        <PostCard key={post.id} viewer={viewer} post={post} />
      ))}

      <div ref={sentinelRef} className="h-1 w-full" />

      <div className="px-4 py-4 text-center text-sm sm:px-5">
        {loading && (
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando mais publicações...
          </div>
        )}

        {!loading && error && (
          <div className="space-y-2 text-muted-foreground">
            <p>{error}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadMore()}
              className="mx-auto"
            >
              <RefreshCcw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        )}

        {!loading && !error && !hasMore && (
          <p className="text-muted-foreground">Você chegou ao fim do feed.</p>
        )}
      </div>
    </div>
  );
}
