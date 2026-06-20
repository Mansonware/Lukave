import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <Card variant="glass" className="animate-scale-in shadow-premium-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Entrar no NEXUS</CardTitle>
        <CardDescription>
          Acesse sua conta para criar, conectar e monetizar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
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
