import Link from "next/link";
import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Criar conta" };

export default function RegisterPage() {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Criar sua conta</CardTitle>
        <CardDescription>
          Junte-se ao NEXUS e comece a criar hoje mesmo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
