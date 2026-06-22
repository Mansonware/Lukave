import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <Card className="animate-fade-in border-white/[0.08] shadow-xl shadow-black/20">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-2xl bg-nexus-gradient shadow-lg shadow-primary/25">
          <span className="text-lg font-bold text-white">N</span>
        </div>
        <CardTitle className="text-2xl">Entrar no NEXUS</CardTitle>
        <CardDescription>
          Acesse sua conta para criar, conectar e monetizar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card/60 px-2 text-muted-foreground">ou</span>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
