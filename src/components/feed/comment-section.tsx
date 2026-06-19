"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addComment, getComments } from "@/server/actions/posts";
import { formatTimeAgo, getInitials } from "@/lib/utils";
import type { CommentData, Viewer } from "@/types/post";

export function CommentSection({
  postId,
  viewer,
  onCountChange,
}: {
  postId: string;
  viewer: Viewer;
  onCountChange?: (delta: number) => void;
}) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    getComments(postId).then((data) => {
      if (active) {
        setComments(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [postId]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const content = value.trim();
    if (!content) return;

    startTransition(async () => {
      const res = await addComment({ postId, content });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setComments((prev) => [
        {
          id: res.data!.id,
          content,
          createdAt: new Date(),
          author: {
            id: viewer.id,
            name: viewer.name,
            username: viewer.username,
            image: viewer.image,
            role: "USER",
          },
        },
        ...prev,
      ]);
      setValue("");
      onCountChange?.(1);
    });
  }

  return (
    <div className="border-t border-border px-4 py-3">
      <form onSubmit={submit} className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          {viewer.image && <AvatarImage src={viewer.image} alt={viewer.username} />}
          <AvatarFallback>{getInitials(viewer.name ?? viewer.username)}</AvatarFallback>
        </Avatar>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escreva um comentário..."
          maxLength={500}
          className="h-10"
        />
        <Button type="submit" size="icon" disabled={pending || !value.trim()}>
          {pending ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </form>

      <div className="mt-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-4 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <p className="py-2 text-center text-sm text-muted-foreground">
            Seja o primeiro a comentar.
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Link href={`/${c.author.username}`}>
                <Avatar className="h-8 w-8">
                  {c.author.image && (
                    <AvatarImage src={c.author.image} alt={c.author.username} />
                  )}
                  <AvatarFallback>
                    {getInitials(c.author.name ?? c.author.username)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 rounded-2xl bg-white/[0.04] px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <Link
                    href={`/${c.author.username}`}
                    className="font-semibold hover:underline"
                  >
                    {c.author.name ?? c.author.username}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(c.createdAt)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap break-words text-sm text-foreground/90">
                  {c.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
