import Link from "next/link";
import { Bell, Heart, MessageCircle, ShoppingBag, UserPlus } from "lucide-react";
import type { Metadata } from "next";

import { requireUser } from "@/lib/session";
import { getNotifications } from "@/server/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { MarkAllReadButton } from "@/components/notifications/mark-all-read";
import { cn, formatTimeAgo, getInitials } from "@/lib/utils";

export const metadata: Metadata = { title: "Notificações" };

const config = {
  LIKE: { icon: Heart, color: "text-nexus-pink", verb: "curtiu sua publicação" },
  COMMENT: {
    icon: MessageCircle,
    color: "text-accent",
    verb: "comentou na sua publicação",
  },
  FOLLOW: { icon: UserPlus, color: "text-nexus-green", verb: "começou a seguir você" },
  PURCHASE: { icon: ShoppingBag, color: "text-nexus-purple", verb: "compra confirmada" },
} as const;

export default async function NotificationsPage() {
  const user = await requireUser();
  const notifications = await getNotifications(user.id);

  return (
    <div className="mx-auto w-full max-w-2xl border-x border-border">
      <PageHeader
        title="Notificações"
        action={notifications.some((n) => !n.read) ? <MarkAllReadButton /> : undefined}
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Sem notificações"
          description="Curtidas, comentários e novos seguidores aparecerão aqui."
        />
      ) : (
        <div>
          {notifications.map((n) => {
            const c = config[n.type];
            const Icon = c.icon;
            const actorName = n.actor?.name ?? n.actor?.username ?? "Alguém";
            const href = n.postId
              ? `/post/${n.postId}`
              : n.actor
                ? `/${n.actor.username}`
                : "#";

            return (
              <Link
                key={n.id}
                href={href}
                className={cn(
                  "flex items-center gap-3 border-b border-border px-4 py-3.5 transition-colors hover:bg-white/[0.02] sm:px-5",
                  !n.read && "bg-primary/[0.06]",
                )}
              >
                <div className={cn("shrink-0", c.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <Avatar className="h-9 w-9">
                  {n.actor?.image && (
                    <AvatarImage src={n.actor.image} alt={n.actor.username} />
                  )}
                  <AvatarFallback>{getInitials(actorName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-sm">
                  <span className="font-semibold">{actorName}</span>{" "}
                  <span className="text-muted-foreground">{c.verb}</span>
                  <span className="ml-1 text-xs text-muted-foreground">
                    · {formatTimeAgo(n.createdAt)}
                  </span>
                </div>
                {!n.read && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-nexus-gradient" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
