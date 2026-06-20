"use client";

import { useState, useTransition } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { Button, type ButtonProps } from "@/components/ui/button";
import { toggleFollow } from "@/server/actions/follow";
import { cn } from "@/lib/utils";

export function FollowButton({
  targetUserId,
  initialFollowing,
  size = "sm",
  className,
}: {
  targetUserId: string;
  initialFollowing: boolean;
  size?: ButtonProps["size"];
  className?: string;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();

  function onClick() {
    const next = !following;
    setFollowing(next);
    startTransition(async () => {
      const res = await toggleFollow(targetUserId);
      if (!res.ok) {
        setFollowing(!next);
        toast.error(res.error);
      } else {
        setFollowing(res.data!.following);
      }
    });
  }

  return (
    <Button
      onClick={onClick}
      loading={pending}
      size={size}
      variant={following ? "outline" : "gradient"}
      className={cn("group/follow", className)}
    >
      {!pending &&
        (following ? (
          <UserCheck className="transition-transform group-hover/follow:scale-110" />
        ) : (
          <UserPlus className="transition-transform group-hover/follow:scale-110" />
        ))}
      {following ? "Seguindo" : "Seguir"}
    </Button>
  );
}
