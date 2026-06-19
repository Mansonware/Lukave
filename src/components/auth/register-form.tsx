"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/server/actions/auth";
import type { ActionResult } from "@/server/action-result";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      Criar conta
    </Button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    registerUser,
    undefined,
  );

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Conta criada! Entrando...");
      // Autentica com os dados recém-criados
      const form = document.getElementById("register-form") as HTMLFormElement;
      const data = new FormData(form);
      signIn("credentials", {
        email: String(data.get("email") ?? "").toLowerCase(),
        password: String(data.get("password") ?? ""),
        redirect: false,
      }).then((res) => {
        if (res?.error) {
          router.push("/login");
        } else {
          router.push("/feed");
          router.refresh();
        }
      });
    } else {
      toast.error(state.error);
    }
  }, [state, router]);

  const fe = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form id="register-form" action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" placeholder="Seu nome" required />
        {fe?.name && <p className="text-xs text-destructive">{fe.name[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="seu_user"
          required
        />
        {fe?.username && (
          <p className="text-xs text-destructive">{fe.username[0]}</p>
        )}
      </div>
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
        {fe?.email && <p className="text-xs text-destructive">{fe.email[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          required
        />
        {fe?.password && (
          <p className="text-xs text-destructive">{fe.password[0]}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
