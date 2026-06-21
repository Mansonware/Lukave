"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StoryViewer } from "@/components/stories/story-viewer";
import { getInitials } from "@/lib/utils";
import type { StoryGroup } from "@/types/story";
import type { Viewer } from "@/types/post";

interface StoriesBarProps {
  groups: StoryGroup[];
  viewer: Viewer;
}

export function StoriesBar({ groups, viewer }: StoriesBarProps) {
  const [openGroupIndex, setOpenGroupIndex] = useState<number | null>(null);

  if (groups.length === 0) return null;

  // Own story is always first (getActiveStories already sorts isOwn first)
  const ownGroup = groups.find((g) => g.isOwn);
  const otherGroups = groups.filter((g) => !g.isOwn);
  const allGroups: StoryGroup[] = ownGroup ? [ownGroup, ...otherGroups] : groups;

  return (
    <>
      <div className="border-b border-border px-4 py-3 sm:px-5">
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
          {/* Own story slot */}
          <button
            type="button"
            className="flex shrink-0 flex-col items-center gap-1.5"
            onClick={() => ownGroup && setOpenGroupIndex(0)}
            disabled={!ownGroup}
          >
            <div
              className={
                ownGroup
                  ? "rounded-full bg-nexus-gradient p-0.5"
                  : "rounded-full border-2 border-dashed border-border p-0.5"
              }
            >
              <Avatar className="h-12 w-12 bg-background ring-2 ring-background">
                <AvatarImage src={viewer.image ?? undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(viewer.name ?? viewer.username)}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="max-w-[56px] truncate text-[11px] text-muted-foreground">
              Seu story
            </span>
            {!ownGroup && (
              <span className="sr-only">Nenhum story ativo</span>
            )}
          </button>

          {/* Other users' stories */}
          {otherGroups.map((group, idx) => {
            const indexInAll = ownGroup ? idx + 1 : idx;
            return (
              <button
                key={group.author.id}
                type="button"
                className="flex shrink-0 flex-col items-center gap-1.5"
                onClick={() => setOpenGroupIndex(indexInAll)}
              >
                <div className="rounded-full bg-nexus-gradient p-0.5">
                  <Avatar className="h-12 w-12 bg-background ring-2 ring-background">
                    <AvatarImage src={group.author.image ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(group.author.name ?? group.author.username)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="max-w-[56px] truncate text-[11px] text-muted-foreground">
                  {group.author.name ?? group.author.username}
                </span>
              </button>
            );
          })}

          {/* Add story CTA when there is no own story — informational only */}
          {!ownGroup && (
            <div
              className="flex shrink-0 flex-col items-center gap-1.5 opacity-40"
              aria-label="Você ainda não tem um story ativo. Faça upload de uma mídia para criar o seu."
            >
              <div className="grid h-[52px] w-[52px] place-items-center rounded-full border border-dashed border-border">
                <PlusCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="max-w-[56px] text-[11px] text-muted-foreground">
                Adicionar
              </span>
            </div>
          )}
        </div>
      </div>

      {openGroupIndex !== null && (
        <StoryViewer
          groups={allGroups}
          initialGroupIndex={openGroupIndex}
          onClose={() => setOpenGroupIndex(null)}
        />
      )}
    </>
  );
}
