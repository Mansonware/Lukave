"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);

  return (
    <div
      className="flex min-h-[50dvh] flex-col items-center justify-center gap-5 px-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div>
        <h2 className="font-display text-xl font-bold">Algo deu errado</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Ocorreu um erro inesperado. Tente novamente ou recarregue a página.
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        <RefreshCcw className="h-4 w-4" />
        Tentar novamente
      </Button>
    </div>
  );
}
