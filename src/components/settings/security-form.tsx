"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { signOut } from "next-auth/react";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { changePassword } from "@/server/actions/profile";
import type { ActionResult } from "@/server/action-result";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      Alterar senha
    </Button>
  );
}

export function SecurityForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    changePassword,
    undefined,
  );

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Senha alterada com sucesso!");
      formRef.current?.reset();
    } else {
      toast.error(state.error);
    }
  }, [state]);

  const fe = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <div className="space-y-8">
      <form ref={formRef} action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Senha atual</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nova senha</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            required
          />
          {fe?.newPassword && (
            <p className="text-xs text-destructive">{fe.newPassword[0]}</p>
          )}
        </div>
        <SaveButton />
      </form>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Encerrar sessão</p>
          <p className="text-xs text-muted-foreground">
            Sair da sua conta neste dispositivo.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>
    </div>
  );
}
