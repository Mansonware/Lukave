"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Link2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommentSection } from "@/components/feed/comment-section";
import { toggleLike, sharePost, deletePost } from "@/server/actions/posts";
import {
  cn,
  formatCompactNumber,
  formatTimeAgo,
  getInitials,
  absoluteUrl,
} from "@/lib/utils";
import type { PostCardData, Viewer } from "@/types/post";

export function PostCard({
  post,
  viewer,
}: {
  post: PostCardData;
  viewer: Viewer;
}) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likes, setLikes] = useState(post.likesCount);
  const [shared, setShared] = useState(post.sharedByMe);
  const [shares, setShares] = useState(post.sharesCount);
  const [comments, setComments] = useState(post.commentsCount);
  const [showComments, setShowComments] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [, startTransition] = useTransition();

  const isOwner = viewer.id === post.author.id;

  function handleLike() {
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    startTransition(async () => {
      const res = await toggleLike(post.id);
      if (!res.ok) {
        setLiked(!next);
        setLikes((n) => n + (next ? -1 : 1));
        toast.error(res.error);
      } else {
        setLiked(res.data!.liked);
        setLikes(res.data!.likesCount);
      }
    });
  }

  function handleShare() {
    const next = !shared;
    setShared(next);
    setShares((n) => n + (next ? 1 : -1));
    navigator.clipboard
      ?.writeText(absoluteUrl(`/post/${post.id}`))
      .then(() => toast.success("Link copiado para a área de transferência"))
      .catch(() => {});
    startTransition(async () => {
      const res = await sharePost(post.id);
      if (!res.ok) {
        setShared(!next);
        setShares((n) => n + (next ? -1 : 1));
        toast.error(res.error);
      } else {
        setShared(res.data!.shared);
        setShares(res.data!.sharesCount);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const res = await deletePost(post.id);
      if (!res.ok) toast.error(res.error);
      else {
        setDeleted(true);
        toast.success("Publicação excluída");
      }
    });
  }

  if (deleted) return null;

  return (
    <article className="border-b border-white/5 px-3 py-3.5 transition-colors duration-200 hover:bg-white/[0.02] active:bg-white/[0.03] sm:px-5 sm:py-4 relative group">
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex gap-3">
        <Link href={`/${post.author.username}`} className="shrink-0">
          <Avatar className="h-11 w-11 nexus-ring">
            {post.author.image && (
              <AvatarImage src={post.author.image} alt={post.author.username} />
            )}
            <AvatarFallback>
              {getInitials(post.author.name ?? post.author.username)}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm">
              <Link
                href={`/${post.author.username}`}
                className="truncate font-semibold hover:underline"
              >
                {post.author.name ?? post.author.username}
              </Link>
              {post.author.role === "CREATOR" && (
                <Badge className="px-1.5 py-0 text-[10px]">Criador</Badge>
              )}
              <span className="truncate text-muted-foreground">
                @{post.author.username}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="shrink-0 text-muted-foreground">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-lg p-1.5 text-muted-foreground outline-none hover:bg-white/[0.06] hover:text-foreground active:bg-white/[0.1]">
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {post.content && (
            <p className="mt-1.5 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground/90">
              {post.content}
            </p>
          )}

          {post.media.length > 0 && (
            // Edge-to-edge no mobile: margens negativas cancelam o padding do
            // article (px-3 = 12px) + a coluna do avatar (44px) + gap (12px) = 68px
            // à esquerda e 12px à direita. Em sm+ volta a ficar contido e arredondado.
            <div
              className={cn(
                "mt-3 grid gap-0.5 overflow-hidden border-y border-white/5 w-[100vw] relative left-1/2 -translate-x-1/2 sm:static sm:w-auto sm:translate-x-0 sm:gap-1 sm:rounded-2xl sm:border sm:border-white/10 sm:shadow-lg",
                post.media.length === 1 ? "grid-cols-1" : "grid-cols-2",
              )}
            >
              {post.media.map((m) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={m.id}
                  src={m.url}
                  alt="Mídia da publicação"
                  className="h-full max-h-[480px] w-full object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          {/* Ações — min-h-11 garante 44px de touch target */}
          <div className="mt-2 flex items-center gap-0.5 text-muted-foreground">
            <button
              onClick={handleLike}
              className={cn(
                "group/btn flex min-h-11 items-center gap-1.5 rounded-full px-2.5 py-2 text-sm transition-all duration-200 hover:bg-nuk-pink/10 hover:text-nuk-pink active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                liked && "text-nuk-pink",
              )}
              aria-pressed={liked}
            >
              <Heart className={cn("h-[18px] w-[18px]", liked && "fill-current")} />
              {likes > 0 && formatCompactNumber(likes)}
            </button>

            <button
              onClick={() => setShowComments((s) => !s)}
              className="flex min-h-11 items-center gap-1.5 rounded-full px-2.5 py-2 text-sm transition-all duration-200 hover:bg-accent/10 hover:text-accent active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Mostrar comentários"
              aria-expanded={showComments}
            >
              <MessageCircle className="h-[18px] w-[18px]" />
              {comments > 0 && formatCompactNumber(comments)}
            </button>

            <button
              onClick={handleShare}
              className={cn(
                "flex min-h-11 items-center gap-1.5 rounded-full px-2.5 py-2 text-sm transition-all duration-200 hover:bg-nuk-green/10 hover:text-nuk-green active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                shared && "text-nuk-green",
              )}
              aria-pressed={shared}
            >
              <Share2 className="h-[18px] w-[18px]" />
              {shares > 0 && formatCompactNumber(shares)}
            </button>

            <Link
              href={`/post/${post.id}`}
              className="ml-auto flex min-h-11 items-center gap-1.5 rounded-full px-2.5 py-2 text-sm transition-colors hover:bg-white/[0.06] hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Abrir publicação"
            >
              <Link2 className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-3 -mx-3 sm:-mx-5">
          <CommentSection
            postId={post.id}
            viewer={viewer}
            onCountChange={(d) => setComments((n) => n + d)}
          />
        </div>
      )}
    </article>
  );
}
