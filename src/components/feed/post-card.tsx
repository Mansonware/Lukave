"use client";

import { memo, useCallback, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostHeader } from "@/components/feed/post-header";
import { PostMedia } from "@/components/feed/post-media";
import { PostActions } from "@/components/feed/post-actions";
import { CommentSection } from "@/components/feed/comment-section";
import { toggleLike, sharePost, deletePost } from "@/server/actions/posts";
import { getInitials, absoluteUrl } from "@/lib/utils";
import type { PostCardData, Viewer } from "@/types/post";

export const PostCard = memo(function PostCard({
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

  const handleLike = useCallback(() => {
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
  }, [liked, post.id]);

  const handleShare = useCallback(() => {
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
  }, [shared, post.id]);

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      const res = await deletePost(post.id);
      if (!res.ok) toast.error(res.error);
      else {
        setDeleted(true);
        toast.success("Publicação excluída");
      }
    });
  }, [post.id]);

  const handleToggleComments = useCallback(() => {
    setShowComments((s) => !s);
  }, []);

  if (deleted) return null;

  return (
    <article className="border-b border-border px-4 py-4 transition-colors hover:bg-white/[0.015] sm:px-5">
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
          <PostHeader
            author={post.author}
            createdAt={post.createdAt}
            isOwner={isOwner}
            onDelete={handleDelete}
          />

          {post.content && (
            <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground/90">
              {post.content}
            </p>
          )}

          <PostMedia media={post.media} />

          <PostActions
            postId={post.id}
            liked={liked}
            likes={likes}
            shared={shared}
            shares={shares}
            comments={comments}
            onLike={handleLike}
            onShare={handleShare}
            onToggleComments={handleToggleComments}
          />
        </div>
      </div>

      {showComments && (
        <div className="-mx-4 mt-3 sm:-mx-5">
          <CommentSection
            postId={post.id}
            viewer={viewer}
            onCountChange={(d) => setComments((n) => n + d)}
          />
        </div>
      )}
    </article>
  );
});
