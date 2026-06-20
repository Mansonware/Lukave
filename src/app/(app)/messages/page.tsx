import { Suspense } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { Metadata } from "next";

import { requireUser } from "@/lib/session";
import { getConversations } from "@/server/queries/messages";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const metadata: Metadata = { title: "Mensagens" };

export default async function MessagesPage() {
  const user = await requireUser();
  const conversations = await getConversations(user.id);

  return (
    <div className="flex gap-6">
      <div className="mx-auto w-full max-w-2xl border-x border-border min-h-screen bg-background">
        <PageHeader title="Mensagens" description="Suas conversas no NEXUS" />

        {conversations.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="Nenhuma mensagem"
            description="Você ainda não tem conversas. Comece a interagir no perfil de outros usuários."
          />
        ) : (
          <div className="divide-y divide-border">
            {conversations.map((c) => (
              <Link
                key={c.id}
                href={`/messages/${c.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={c.otherMember?.image || ""} />
                  <AvatarFallback>{c.otherMember?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold truncate">{c.otherMember?.name || c.otherMember?.username}</h3>
                    {c.lastMessage && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(c.lastMessage.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-sm truncate ${c.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {c.lastMessage?.content || "Nova conversa"}
                    </p>
                    {c.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
