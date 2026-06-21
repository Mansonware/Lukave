"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo, getInitials } from "@/lib/utils";
import type { StoryGroup } from "@/types/story";

const STORY_DURATION_MS = 5_000;
const TICK_MS = 50;

interface StoryViewerProps {
  groups: StoryGroup[];
  initialGroupIndex: number;
  onClose: () => void;
}

export function StoryViewer({
  groups,
  initialGroupIndex,
  onClose,
}: StoryViewerProps) {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const group = groups[groupIndex];
  const story = group?.stories[storyIndex];

  const goNext = useCallback(() => {
    if (!group) {
      onClose();
      return;
    }
    if (storyIndex < group.stories.length - 1) {
      setStoryIndex((i) => i + 1);
    } else if (groupIndex < groups.length - 1) {
      setGroupIndex((g) => g + 1);
      setStoryIndex(0);
    } else {
      onClose();
    }
  }, [group, groupIndex, groups.length, storyIndex, onClose]);

  const goPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((i) => i - 1);
    } else if (groupIndex > 0) {
      const prevGroup = groups[groupIndex - 1];
      setGroupIndex((g) => g - 1);
      setStoryIndex(prevGroup ? prevGroup.stories.length - 1 : 0);
    }
  }, [groupIndex, groups, storyIndex]);

  // Auto-advance timer — resets whenever story or group changes
  useEffect(() => {
    setProgress(0);
    let step = 0;
    const totalSteps = STORY_DURATION_MS / TICK_MS;

    const id = setInterval(() => {
      step += 1;
      setProgress(Math.min((step / totalSteps) * 100, 100));
      if (step >= totalSteps) {
        clearInterval(id);
        goNext();
      }
    }, TICK_MS);

    return () => clearInterval(id);
  }, [groupIndex, storyIndex, goNext]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goNext, goPrev]);

  if (!group || !story) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Visualizador de stories"
    >
      {/* Backdrop click closes */}
      <div
        className="absolute inset-0"
        role="button"
        tabIndex={-1}
        aria-label="Fechar story"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
      />

      {/* Story card */}
      <div className="relative z-10 mx-auto flex h-[calc(100svh-48px)] max-h-[680px] w-full max-w-[400px] overflow-hidden rounded-3xl bg-black shadow-2xl">
        {/* Progress bars */}
        <div className="absolute left-0 right-0 top-0 z-20 flex gap-1 px-3 pt-3">
          {group.stories.map((s, i) => (
            <div
              key={s.id}
              className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full bg-white transition-none"
                style={{
                  width:
                    i < storyIndex
                      ? "100%"
                      : i === storyIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Author bar */}
        <div className="absolute left-0 right-0 top-5 z-20 flex items-center justify-between px-4 pt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-white/70">
              <AvatarImage src={group.author.image ?? undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(group.author.name ?? group.author.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold leading-none text-white">
                {group.author.name ?? group.author.username}
              </p>
              <p className="mt-0.5 text-xs text-white/60">
                {formatTimeAgo(story.createdAt)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Media */}
        {story.mediaType === "VIDEO" ? (
          <video
            key={story.id}
            src={story.mediaUrl}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={story.id}
            src={story.mediaUrl}
            alt={`Story de ${group.author.name ?? group.author.username}`}
            className="h-full w-full object-cover"
          />
        )}

        {/* Tap zones: left = prev, right = next */}
        <div className="absolute inset-0 z-10 flex">
          <button
            type="button"
            className="h-full w-1/3 cursor-default"
            aria-label="História anterior"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          />
          <div className="h-full flex-1" />
          <button
            type="button"
            className="h-full w-1/3 cursor-default"
            aria-label="Próxima história"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          />
        </div>
      </div>
    </div>
  );
}
