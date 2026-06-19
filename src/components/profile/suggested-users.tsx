import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/profile/follow-button";
import { getSuggestedUsers } from "@/server/queries";
import { formatCompactNumber, getInitials } from "@/lib/utils";

export async function SuggestedUsers({ viewerId }: { viewerId: string }) {
  const users = await getSuggestedUsers(viewerId, 5);
  if (users.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-4">
      <h2 className="mb-3 font-display text-sm font-semibold">Quem seguir</h2>
      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-3">
            <Link href={`/${u.username}`} className="shrink-0">
              <Avatar className="h-10 w-10">
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
