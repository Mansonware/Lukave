"use client";

import { memo } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Link2 } from "lucide-react";

import { cn, formatCompactNumber } from "@/lib/utils";

interface PostActionsProps {
  postId: string;
  liked: boolean;
  likes: number;
  shared: boolean;
  shares: number;
  comments: number;
  onLike: () => void;
  onShare: () => void;
  onToggleComments: () => void;
}

export const PostActions = memo(function PostActions({
  postId,
  liked,
  likes,
  shared,
  shares,
  comments,
  onLike,
  onShare,
  onToggleComments,
}: PostActionsProps) {
  return (
    <div className="mt-3 flex items-center gap-1 text-muted-foreground">
      <button
        onClick={onLike}
        className={cn(
          "group flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors hover:bg-nexus-pink/10 hover:text-nexus-pink",
          liked && "text-nexus-pink",
        )}
        aria-pressed={liked}
        aria-label={liked ? "Descurtir publicação" : "Curtir publicação"}
      >
        <Heart className={cn("h-[18px] w-[18px]", liked && "fill-current")} />
        {likes > 0 && (
          <span aria-label={`${likes} curtidas`}>
            {formatCompactNumber(likes)}
          </span>
        )}
      </button>

      <button
        onClick={onToggleComments}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors hover:bg-accent/10 hover:text-accent"
        aria-label={`${comments} comentários, abrir seção de comentários`}
      >
        <MessageCircle className="h-[18px] w-[18px]" />
        {comments > 0 && formatCompactNumber(comments)}
      </button>

      <button
        onClick={onShare}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors hover:bg-nexus-green/10 hover:text-nexus-green",
          shared && "text-nexus-green",
        )}
        aria-pressed={shared}
        aria-label={shared ? "Compartilhado" : "Compartilhar publicação"}
      >
        <Share2 className="h-[18px] w-[18px]" />
        {shares > 0 && formatCompactNumber(shares)}
      </button>

      <Link
        href={`/post/${postId}`}
        className="ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors hover:bg-white/[0.06] hover:text-foreground"
        aria-label="Abrir publicação"
      >
        <Link2 className="h-[18px] w-[18px]" />
      </Link>
    </div>
  );
});
