import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo withWordmark={false} className="scale-150" />
      <div>
        <h1 className="font-display text-5xl font-bold text-gradient">404</h1>
        <p className="mt-2 text-muted-foreground">
          Não encontramos a página que você procura.
        </p>
      </div>
      <Button asChild>
        <Link href="/feed">Voltar ao início</Link>
      </Button>
    </div>
  );
}
