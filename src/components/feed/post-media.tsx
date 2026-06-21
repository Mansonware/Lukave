import { memo } from "react";

import { cn } from "@/lib/utils";
import type { PostMediaData } from "@/types/post";

interface PostMediaProps {
  media: PostMediaData[];
}

export const PostMedia = memo(function PostMedia({ media }: PostMediaProps) {
  if (media.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-3 grid gap-1.5 overflow-hidden rounded-2xl border border-border",
        media.length === 1 ? "grid-cols-1" : "grid-cols-2",
      )}
    >
      {media.map((m) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={m.id}
          src={m.url}
          alt="Mídia da publicação"
          className="h-full max-h-[520px] w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
});
