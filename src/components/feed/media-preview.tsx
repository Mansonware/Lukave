"use client";

import { memo } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface MediaPreviewProps {
  media: string[];
  onRemove: (url: string) => void;
}

export const MediaPreview = memo(function MediaPreview({
  media,
  onRemove,
}: MediaPreviewProps) {
  if (media.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-2 grid gap-1.5",
        media.length === 1 ? "grid-cols-1" : "grid-cols-2",
      )}
    >
      {media.map((url) => (
        <div
          key={url}
          className="relative overflow-hidden rounded-xl border border-border"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Pré-visualização da imagem"
            className="h-40 w-full object-cover"
            loading="lazy"
          />
          <button
            type="button"
            onClick={() => onRemove(url)}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
            aria-label="Remover imagem"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
});
