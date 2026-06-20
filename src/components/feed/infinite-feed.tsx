"use client";

import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/feed/post-card";
import { useInfiniteFeed } from "@/hooks/use-infinite-feed";
import type { PostCardData, Viewer } from "@/types/post";

export function InfiniteFeed({
  initialPosts,
  initialCursor,
  viewer,
}: {
  initialPosts: PostCardData[];
  initialCursor: string | null;
  viewer: Viewer;
}) {
  const { posts, loading, error, hasMore, sentinelRef, loadMore } = useInfiniteFeed({
    initialPosts,
    initialCursor,
  });

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} viewer={viewer} post={post} />
      ))}

      <div ref={sentinelRef} className="h-1 w-full" />

      {loading && (
        <div className="space-y-3 px-4 py-4 sm:px-5">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-border px-4 py-4"
            >
              <div className="h-4 w-32 rounded bg-white/[0.08]" />
              <div className="mt-3 h-3 w-full rounded bg-white/[0.06]" />
              <div className="mt-2 h-3 w-5/6 rounded bg-white/[0.06]" />
            </div>
          ))}
        </div>
      )}

      <div className="px-4 py-4 text-center text-sm sm:px-5">
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
