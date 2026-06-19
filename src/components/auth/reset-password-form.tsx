"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/server/actions/auth";
import type { ActionResult } from "@/server/action-result";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      Redefinir senha
    </Button>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    resetPassword,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) {
      toast.success("Senha redefinida! Faça login.");
      router.push("/login");
    } else if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-2">
        <Label htmlFor="password">Nova senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
