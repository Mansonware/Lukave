"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
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
      try {
        const res = await toggleFollow({ targetUserId });
        if (!res.ok) {
          setFollowing(initialFollowing);
          toast.error(res.error || "Erro ao seguir usuário.");
        } else if (res.data) {
          setFollowing(res.data.following);
        }
      } catch (error) {
        setFollowing(initialFollowing);
        toast.error("Erro ao seguir usuário.");
      }
    });
  }

  return (
    <Button
      onClick={onClick}
      disabled={pending}
      size={size}
      variant={following ? "outline" : "default"}
      className={cn(className)}
    >
      {pending && <Loader2 className="animate-spin" />}
      {following ? "Seguindo" : "Seguir"}
    </Button>
  );
}
