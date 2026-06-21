import type { Metadata } from "next";
import { CheckCircle2, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { MobileTemplateScreen } from "@/components/template/mobile-template-screen";

export const metadata: Metadata = {
  title: "Mobile Template",
};

const highlights = [
  "Header com busca, notificações e segmentação de feed",
  "Stories horizontais com cards visuais e destaques",
  "Feed com post cards, métricas e CTA de mídia",
  "Bottom navigation pronta para evoluir para o app mobile",
];

export default function MobileTemplatePage() {
  return (
    <main className="container py-10 sm:py-14">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="flex justify-center lg:justify-start">
          <MobileTemplateScreen />
        </div>

        <section className="space-y-6">
          <Badge variant="outline" className="gap-2 py-1.5">
            <Smartphone className="h-3.5 w-3.5" />
            UI mobile template
          </Badge>

          <div className="space-y-4">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Template social para o{" "}
              <span className="text-gradient">nuk-plataforma</span>
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Uma tela principal pronta para evoluir em um app estilo TikTok,
              Instagram ou Facebook, usando dados mockados e componentes
              reaproveitáveis consistentes com o design system atual do projeto.
            </p>
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="font-display text-xl font-semibold">
              Elementos entregues
            </h2>
            <div className="mt-4 grid gap-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm text-foreground/85">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
