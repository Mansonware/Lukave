import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

import { requireUser } from "@/lib/session";
import { getPostById } from "@/server/queries";
import { PostCard } from "@/components/feed/post-card";
import { CommentSection } from "@/components/feed/comment-section";
import type { Viewer } from "@/types/post";

export const metadata: Metadata = { title: "Publicação" };

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const post = await getPostById(id, user.id);
  if (!post) notFound();

  const viewer: Viewer = {
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
  };

  return (
    <div className="mx-auto w-full max-w-2xl border-x border-border">
      <div className="sticky top-14 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:top-16">
        <Link
          href="/feed"
          className="rounded-lg p-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-lg font-bold">Publicação</h1>
      </div>

      <PostCard
        viewer={viewer}
        post={{
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
        }}
      />

      <CommentSection postId={post.id} viewer={viewer} />
    </div>
  );
}
