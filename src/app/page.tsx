import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpen,
  Check,
  CircleDollarSign,
  Compass,
  Heart,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  Zap,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { getSession } from "@/lib/session";

const features = [
  {
    icon: Compass,
    title: "Feed que descobre você",
    description:
      "Conteúdo relevante, comunidades e criadores reunidos em uma experiência rápida e personalizada.",
  },
  {
    icon: Users,
    title: "Comunidades de verdade",
    description:
      "Crie espaços públicos ou privados, organize membros e fortaleça conexões em torno do que importa.",
  },
  {
    icon: MessageCircle,
    title: "Conversas sem distância",
    description:
      "Mensagens, comentários e interações pensadas para transformar audiência em relacionamento.",
  },
  {
    icon: Store,
    title: "Marketplace integrado",
    description:
      "Venda produtos digitais, serviços e conteúdos sem tirar sua comunidade da plataforma.",
  },
  {
    icon: CircleDollarSign,
    title: "Monetização para criadores",
    description:
      "Assinaturas, conteúdos exclusivos e novas formas de gerar receita com sua presença digital.",
  },
  {
    icon: ShieldCheck,
    title: "Ambiente confiável",
    description:
      "Privacidade, moderação e segurança desde a base para uma rede saudável e sustentável.",
  },
];

const highlights = [
  "Perfil completo e personalizável",
  "Feed social responsivo",
  "Busca de pessoas e conteúdo",
  "Notificações em tempo real",
];

export default async function LandingPage() {
  const session = await getSession();
  const primaryHref = session?.user ? "/feed" : "/register";
  const primaryLabel = session?.user ? "Ir para o feed" : "Criar conta grátis";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.20),transparent_38%),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.13),transparent_34%)]" />
      <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/75 backdrop-blur-2xl">
        <div className="container flex h-16 items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#recursos" className="transition-colors hover:text-foreground">
              Recursos
            </a>
            <a href="#experiencia" className="transition-colors hover:text-foreground">
              Experiência
            </a>
            <a href="#comecar" className="transition-colors hover:text-foreground">
              Começar
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {!session?.user && (
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">Entrar</Link>
              </Button>
            )}
            <Button asChild size="sm">
              <Link href={primaryHref}>
                {session?.user ? "Abrir Lukave" : "Começar"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="container grid min-h-[calc(100dvh-4rem)] items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="max-w-3xl">
            <FadeIn>
              <Badge variant="outline" className="mb-6 gap-2 border-primary/30 bg-primary/5 py-1.5 text-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Uma nova rede para criar, conectar e crescer
              </Badge>
            </FadeIn>

            <FadeIn delay={0.05}>
              <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Seu conteúdo merece um lugar que acompanhe sua{" ""}
                <span className="text-gradient">evolução.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                A Lukave reúne rede social, comunidades, mensagens e monetização em uma plataforma moderna para quem cria, compartilha e constrói audiência.
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="min-w-48 shadow-lg shadow-primary/20">
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="min-w-44 bg-background/40">
                  <a href="#recursos">
                    <Play className="h-4 w-4" />
                    Conhecer a Lukave
                  </a>
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                {["Cadastro gratuito", "Experiência mobile", "Sem cartão de crédito"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.12} className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/20 blur-2xl" />
            <div className="glass-strong relative overflow-hidden rounded-[2rem] border-white/10 p-4 shadow-2xl shadow-black/30 sm:p-5">
              <div className="mb-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 font-display font-bold text-primary">L</div>
                  <div>
                    <p className="text-sm font-semibold">Descobrir</p>
                    <p className="text-xs text-muted-foreground">Seu feed na Lukave</p>
                  </div>
                </div>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">M</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold">Manson</p>
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">@mansonware · agora</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-foreground/90">
                  Construindo experiências digitais que conectam pessoas, ideias e oportunidades. Esse é só o começo. ✦
                </p>

                <div className="mt-4 aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.5),transparent_35%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)))] p-5">
                  <div className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-black/20 p-5 backdrop-blur">
                    <Sparkles className="h-7 w-7 text-primary" />
                    <div>
                      <p className="font-display text-2xl font-bold">Ideias ganham força quando encontram comunidade.</p>
                      <p className="mt-2 text-xs text-muted-foreground">lukave.com</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Heart className="h-4 w-4" /> 248</span>
                  <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4" /> 36</span>
                  <span className="ml-auto flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> Em alta</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        <section id="recursos" className="container py-20 sm:py-28">
          <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">Recursos essenciais</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Tudo o que uma comunidade digital precisa.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
              Uma base social completa, preparada para crescer com criadores, marcas e comunidades.
            </p>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FadeIn key={feature.title} delay={index * 0.04}>
                <article className="glass group h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.04]">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </section>

        <section id="experiencia" className="container py-20 sm:py-28">
          <div className="grid items-center gap-10 rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
            <FadeIn>
              <Badge variant="outline" className="mb-5">Feita para pessoas, não métricas</Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
                Simples para entrar. Poderosa para crescer.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
                A Lukave reduz atrito para quem quer publicar, descobrir conteúdo e participar de comunidades. A experiência prioriza velocidade, clareza e conexão real.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/10 px-4 py-3 text-sm">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-background/70 p-6 sm:translate-y-6">
                  <BookOpen className="h-7 w-7 text-primary" />
                  <p className="mt-8 font-display text-3xl font-bold">Conteúdo</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Publique ideias, histórias, projetos e experiências com liberdade.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-primary p-6 text-primary-foreground">
                  <Users className="h-7 w-7" />
                  <p className="mt-8 font-display text-3xl font-bold">Comunidade</p>
                  <p className="mt-2 text-sm leading-6 text-primary-foreground/75">Encontre pessoas que compartilham seus interesses e objetivos.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/70 p-6 sm:translate-y-6">
                  <Store className="h-7 w-7 text-primary" />
                  <p className="mt-8 font-display text-3xl font-bold">Negócios</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Transforme presença digital em produtos, serviços e receita.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/70 p-6">
                  <Zap className="h-7 w-7 text-primary" />
                  <p className="mt-8 font-display text-3xl font-bold">Evolução</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Uma plataforma viva, construída para ganhar novos recursos continuamente.</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section id="comecar" className="container py-20 sm:py-28">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary/10 px-6 py-14 text-center sm:px-12 sm:py-20">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.22),transparent_55%)]" />
              <div className="relative mx-auto max-w-3xl">
                <Badge className="mb-5">Entre desde o começo</Badge>
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
                  A próxima conexão pode começar agora.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-muted-foreground sm:text-lg">
                  Crie seu perfil, descubra novas comunidades e acompanhe a evolução da Lukave desde os primeiros capítulos.
                </p>
                <Button asChild size="lg" className="mt-8 min-w-52 shadow-lg shadow-primary/25">
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>

      <footer className="border-t border-white/5 py-10">
        <div className="container flex flex-col items-center justify-between gap-5 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <Logo />
          <p>© {new Date().getFullYear()} Lukave. Conecte ideias. Crie possibilidades.</p>
        </div>
      </footer>
    </div>
  );
}
