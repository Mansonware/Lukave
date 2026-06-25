"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { deleteAccount } from "@/server/actions/profile";

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
  
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Senha alterada com sucesso!");
      formRef.current?.reset();
    } else {
      toast.error(state.error);
    }
  }, [state]);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const res = await deleteAccount();
    if (res.ok) {
      toast.success("Conta excluída com sucesso.");
      signOut({ callbackUrl: "/" });
    } else {
      toast.error(res.error || "Erro ao excluir conta.");
      setIsDeleting(false);
    }
  };

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

      <div className="flex flex-col gap-6">
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

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-destructive">Zona de Perigo</p>
            <p className="text-xs text-muted-foreground max-w-[280px]">
              Excluir sua conta é uma ação irreversível. Todos os seus dados, posts e seguidores serão perdidos permanentemente.
            </p>
          </div>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="destructive">Excluir Conta</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm pb-safe">
                <DrawerHeader>
                  <DrawerTitle>Você tem certeza absoluta?</DrawerTitle>
                  <DrawerDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                    e removerá seus dados de nossos servidores.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:gap-0 mt-4">
                  <DrawerClose asChild>
                    <Button variant="outline" disabled={isDeleting}>Cancelar</Button>
                  </DrawerClose>
                  <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                    {isDeleting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    Sim, excluir minha conta
                  </Button>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}
