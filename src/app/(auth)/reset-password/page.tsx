import Link from "next/link";
import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Redefinir senha" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <Card className="animate-fade-in border-white/[0.08] shadow-xl shadow-black/20">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
          <span className="text-lg">🔒</span>
        </div>
        <CardTitle className="text-2xl">Redefinir senha</CardTitle>
        <CardDescription>Escolha uma nova senha para sua conta.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p className="text-center text-sm text-destructive">
            Link inválido ou expirado.{" "}
            <Link href="/forgot-password" className="text-primary hover:underline">
              Solicitar novo link
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
