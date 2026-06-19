"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/server/actions/auth";
import type { ActionResult } from "@/server/action-result";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      Enviar link de recuperação
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    requestPasswordReset,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) setSent(true);
    else if (state && !state.ok) toast.error(state.error);
  }, [state]);

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-nexus-green/15 text-nexus-green">
          <MailCheck className="h-6 w-6" />
        </div>
        <p className="text-sm text-muted-foreground">
          Se houver uma conta com este e-mail, enviamos um link para redefinir
          sua senha. Verifique sua caixa de entrada.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
