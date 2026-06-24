"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startConversation } from "@/server/actions/messages";

export function StartConversationButton({ targetUserId }: { targetUserId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    setIsLoading(true);
    const result = await startConversation({ targetUserId });
    if (!result.ok) {
      console.error(result.error);
      setIsLoading(false);
      return;
    }

    if (result.data) {
      router.push(`/messages/${result.data.conversationId}`);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleStart}
      disabled={isLoading}
      className="ml-2"
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Mensagem
    </Button>
  );
}
