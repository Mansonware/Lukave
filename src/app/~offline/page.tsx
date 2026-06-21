import Link from "next/link";
import type { Metadata } from "next";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Você está offline",
  description: "Sem conexão de internet.",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-4 text-center ambient-bg">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary nexus-ring mb-6">
        <WifiOff className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Você está offline</h1>
      <p className="text-muted-foreground max-w-[300px] mb-8">
        Parece que você perdeu a conexão com a internet. O Núk precisa de uma conexão ativa para carregar os posts e mensagens mais recentes.
      </p>
      
      {/* 
        A link to refresh the page. When the user clicks it, it simply 
        reloads the root URL (which will work if they are back online).
      */}
      <Link 
        href="/"
        className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-[0.85rem] shadow-sm hover:opacity-90 transition-opacity"
      >
        Tentar novamente
      </Link>
    </div>
  );
}
