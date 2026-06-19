"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { markAllNotificationsRead } from "@/server/actions/notifications";

export function MarkAllReadButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await markAllNotificationsRead();
          router.refresh();
        })
      }
    >
      {pending ? <Loader2 className="animate-spin" /> : <CheckCheck />}
      Marcar todas
    </Button>
  );
}
