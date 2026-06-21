import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  Users,
  Sparkles,
  Wallet,
  MessageCircle,
  Store,
  Trophy,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/session";

const FadeIn = dynamic(
  () => import("@/components/motion/fade-in").then((m) => ({ default: m.FadeIn })),
  { ssr: true },
);

const features = [
  {
    icon: Sparkles,
    title: "Crie conteúdo",
    desc: "Publique texto, imagens e em breve vídeos e stories. Um feed premium feito para criadores.",
  },
  {
    icon: Users,
    title: "Construa comunidade",
    desc: "Reúna sua audiência em comunidades públicas, privadas ou por assinatura.",
  },
  {
    icon: MessageCircle,
    title: "Conecte-se",
    desc: "Mensagens diretas, seguidores e um feed inteligente que aproxima você dos seus fãs.",
  },
  {
    icon: Store,
    title: "Venda produtos",
    desc: "Cursos, e-books, templates e arquivos digitais na sua loja de criador.",
  },
  {
    icon: Wallet,
    title: "Monetize",
    desc: "Assinaturas, gorjetas e programa de criadores. Tudo sem depender de terceiros.",
  },
  {
    icon: Trophy,
    title: "Seja reconhecido",
    desc: "Badges, conquistas e ranking para premiar quem mais engaja.",
  },
];

export default async function LandingPage() {
  const session = await getSession();
  const ctaHref = session?.user ? "/feed" : "/register";

  return (
    <div className="relative flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#recursos" className="transition-colors hover:text-foreground">
              Recursos
            </a>
            <a href="#fases" className="transition-colors hover:text-foreground">
              Fases
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={ctaHref}>Começar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="container relative pt-20 pb-24 text-center md:pt-32">
          <FadeIn>
            <Badge variant="outline" className="mb-6 gap-2 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-nexus-green" />
              A nova casa dos criadores
            </Badge>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Crie. Conecte.{" "}
              <span className="text-gradient">Monetize.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              NEXUS é a plataforma tudo-em-um para criadores de conteúdo,
              comunidades e monetização. Tudo o que você precisa, sem depender
              de ferramentas externas.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={ctaHref}>
                  Criar minha conta
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
          </FadeIn>
        </section>

        {/* RECURSOS */}
        <section id="recursos" className="container py-20">
          <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Tudo em um só lugar
            </h2>
            <p className="mt-3 text-muted-foreground">
              Inspirado no melhor do Discord, TikTok e Patreon — em uma
              experiência única e premium.
            </p>
          </FadeIn>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.05}>
                <div className="glass group h-full rounded-2xl p-6 transition-colors hover:border-white/20">
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-nexus-gradient text-white shadow-lg shadow-primary/20">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1.5 font-display text-lg font-semibold">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* FASES */}
        <section id="fases" className="container py-20">
          <FadeIn className="mx-auto max-w-3xl">
            <div className="glass-strong rounded-3xl p-8 text-center sm:p-12">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Construído em 6 fases
              </h2>
              <p className="mt-3 text-muted-foreground">
                Estamos na <strong className="text-foreground">Fase 1 — MVP</strong>:
                contas, perfis, feed, busca e notificações já estão no ar.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {[
                  "1 · MVP",
                  "2 · Social",
                  "3 · Comunidades",
                  "4 · Marketplace",
                  "5 · Monetização",
                  "6 · Expansão",
                ].map((p, i) => (
                  <Badge key={p} variant={i === 0 ? "default" : "secondary"}>
                    {p}
                  </Badge>
                ))}
              </div>
              <Button asChild size="lg" className="mt-9">
                <Link href={ctaHref}>
                  Entrar no NEXUS
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </section>
      </main>

      <footer className="border-t border-white/5 py-10">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} NEXUS. Crie. Conecte. Monetize.</p>
        </div>
      </footer>
    </div>
  );
}
