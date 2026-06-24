import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-8 px-6 text-center overflow-hidden bg-background">
      <div className="absolute inset-0 ambient-bg opacity-50" />
      
      <div className="relative z-10 glass-panel p-10 sm:p-14 rounded-3xl flex flex-col items-center max-w-md w-full">
        <Logo withWordmark={false} className="scale-[2] mb-6 drop-shadow-xl" />
        
        <div>
          <h1 className="font-display text-7xl font-bold text-gradient mb-4">404</h1>
          <p className="text-lg text-muted-foreground font-medium mb-8">
            Parece que você se perdeu no espaço. A página que você procura não existe.
          </p>
        </div>
        
        <Button asChild className="rounded-full px-8 py-6 h-auto text-base group overflow-hidden relative">
          <Link href="/feed">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="relative z-10">Voltar ao início</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
