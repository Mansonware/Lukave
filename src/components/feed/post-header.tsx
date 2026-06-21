import { memo } from "react";
import Link from "next/link";
import { MoreHorizontal, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTimeAgo, getInitials } from "@/lib/utils";
import type { PostAuthor } from "@/types/post";

interface PostHeaderProps {
  author: PostAuthor;
  createdAt: string | Date;
  isOwner: boolean;
  onDelete: () => void;
}

export const PostHeader = memo(function PostHeader({
  author,
  createdAt,
  isOwner,
  onDelete,
}: PostHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link
          href={`/${author.username}`}
          className="truncate font-semibold hover:underline"
        >
          {author.name ?? author.username}
        </Link>
        {author.role === "CREATOR" && (
          <Badge className="px-1.5 py-0 text-[10px]">Criador</Badge>
        )}
        <span className="truncate text-muted-foreground">
          @{author.username}
        </span>
        <span className="text-muted-foreground" aria-hidden="true">·</span>
        <time
          dateTime={new Date(createdAt).toISOString()}
          className="shrink-0 text-muted-foreground"
        >
          {formatTimeAgo(createdAt)}
        </time>
      </div>

      {isOwner && (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="rounded-lg p-1 text-muted-foreground outline-none hover:bg-white/[0.06] hover:text-foreground"
            aria-label="Opções da publicação"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2 /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
});
