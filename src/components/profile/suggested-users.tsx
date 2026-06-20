import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/profile/follow-button";
import { getSuggestedUsers } from "@/server/queries";
import { formatCompactNumber, getInitials } from "@/lib/utils";

export async function SuggestedUsers({ viewerId }: { viewerId: string }) {
  const users = await getSuggestedUsers(viewerId, 5);
  if (users.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-4">
      <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold">
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-nexus-gradient text-white shadow-glow-purple">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        Quem seguir
      </h2>
      <div className="space-y-1">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.04]"
          >
            <Link href={`/${u.username}`} className="shrink-0">
              <Avatar ring>
                {u.image && <AvatarImage src={u.image} alt={u.username} />}
                <AvatarFallback>
                  {getInitials(u.name ?? u.username)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Link href={`/${u.username}`} className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold hover:underline">
                {u.name ?? u.username}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {formatCompactNumber(u.followersCount)} seguidores
              </p>
            </Link>
            <FollowButton targetUserId={u.id} initialFollowing={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
