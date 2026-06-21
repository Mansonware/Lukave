"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startConversation } from "@/server/actions/messages";

export function StartConversationButton({ targetUserId }: { targetUserId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleStart() {
    startTransition(async () => {
      const result = await startConversation(targetUserId);
      if (!result.ok) {
        toast.error(result.error ?? "Não foi possível iniciar a conversa.");
        return;
      }
      if (result.data) {
        router.push(`/messages/${result.data.conversationId}`);
      }
    });
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleStart}
      disabled={isPending}
      className="ml-2"
      aria-label="Enviar mensagem"
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <MessageCircle className="mr-2 h-4 w-4" />
      )}
      Mensagem
    </Button>
  );
}
