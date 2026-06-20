"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  const [burst, setBurst] = useState(0);
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
    if (next) setBurst((b) => b + 1);
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
    <article className="group/post relative border-b border-border-subtle px-4 py-4 transition-colors hover:bg-white/[0.02] sm:px-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-nexus-gradient transition-transform duration-300 group-hover/post:scale-y-100"
      />
      <div className="flex gap-3">
        <Link href={`/${post.author.username}`} className="shrink-0">
          <Avatar ring>
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
            <div className="flex min-w-0 items-center gap-1.5 text-sm">
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
                <DropdownMenuTrigger className="rounded-lg p-1 text-muted-foreground outline-none hover:bg-white/[0.06] hover:text-foreground">
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
            <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground/90">
              {post.content}
            </p>
          )}

          {post.media.length > 0 && (
            <div
              className={cn(
                "mt-3 grid gap-1.5 overflow-hidden rounded-2xl border border-border",
                post.media.length === 1 ? "grid-cols-1" : "grid-cols-2",
              )}
            >
              {post.media.map((m) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={m.id}
                  src={m.url}
                  alt="Mídia da publicação"
                  className="h-full max-h-[520px] w-full object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          {/* Ações */}
          <div className="mt-3 flex items-center gap-1 text-muted-foreground">
            <button
              onClick={handleLike}
              className={cn(
                "group/like relative flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm transition-colors hover:bg-nexus-pink/10 hover:text-nexus-pink active:scale-95",
                liked && "text-nexus-pink",
              )}
              aria-pressed={liked}
              aria-label="Curtir"
            >
              <span className="relative grid place-items-center">
                <Heart
                  className={cn(
                    "h-[18px] w-[18px] transition-transform",
                    liked && "fill-current animate-heart-pop",
                  )}
                />
                {/* explosão de partículas */}
                <AnimatePresence>
                  {burst > 0 && (
                    <span
                      key={burst}
                      className="pointer-events-none absolute inset-0 grid place-items-center"
                    >
                      {Array.from({ length: 6 }).map((_, i) => {
                        const angle = (i / 6) * Math.PI * 2;
                        return (
                          <motion.span
                            key={i}
                            initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
                            animate={{
                              opacity: 0,
                              x: Math.cos(angle) * 16,
                              y: Math.sin(angle) * 16,
                              scale: 1,
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="absolute h-1.5 w-1.5 rounded-full bg-nexus-pink"
                          />
                        );
                      })}
                    </span>
                  )}
                </AnimatePresence>
              </span>
              {likes > 0 && (
                <span className="tabular-nums">{formatCompactNumber(likes)}</span>
              )}
            </button>

            <button
              onClick={() => setShowComments((s) => !s)}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm transition-colors hover:bg-accent/10 hover:text-accent active:scale-95"
              aria-label="Comentar"
            >
              <MessageCircle className="h-[18px] w-[18px]" />
              {comments > 0 && (
                <span className="tabular-nums">{formatCompactNumber(comments)}</span>
              )}
            </button>

            <button
              onClick={handleShare}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm transition-colors hover:bg-nexus-green/10 hover:text-nexus-green active:scale-95",
                shared && "text-nexus-green",
              )}
              aria-pressed={shared}
              aria-label="Compartilhar"
            >
              <Share2 className="h-[18px] w-[18px]" />
              {shares > 0 && (
                <span className="tabular-nums">{formatCompactNumber(shares)}</span>
              )}
            </button>

            <Link
              href={`/post/${post.id}`}
              className="ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm transition-colors hover:bg-white/[0.06] hover:text-foreground active:scale-95"
              aria-label="Ver publicação"
            >
              <Link2 className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-3 -mx-4 sm:-mx-5">
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
