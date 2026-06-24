import Link from "next/link";
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
import { FadeIn } from "@/components/motion/fade-in";
import { getSession } from "@/lib/session";

const features = [
  {
    icon: Sparkles,
    title: "Crie conteúdo",
    desc: "Publique textos e mídias num feed premium, sem algoritmo viciado. Só o que importa.",
  },
  {
    icon: Users,
    title: "Sua comunidade",
    desc: "Reúna sua audiência verdadeira em espaços exclusivos e privados.",
  },
  {
    icon: Wallet,
    title: "Monetize",
    desc: "Assinaturas e gorjetas diretas na sua conta. Sem intermediários, sem surpresas.",
  },
  {
    icon: MessageCircle,
    title: "Conexão direta",
    desc: "Mensagens privadas ágeis, aproximando você de quem realmente apoia seu trabalho.",
  },
  {
    icon: Store,
    title: "Sua loja",
    desc: "Venda cursos, e-books e assets digitais com checkout nativo num só lugar.",
  },
  {
    icon: Trophy,
    title: "Gamificação",
    desc: "Badges e conquistas para engajar e premiar seus fãs mais fiéis.",
  },
];

export default async function LandingPage() {
  const session = await getSession();
  const ctaHref = session?.user ? "/feed" : "/register";

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden ambient-bg">
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/50 backdrop-blur-2xl">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#recursos" className="transition-colors hover:text-foreground">
              Recursos
            </a>
            <a href="#fases" className="transition-colors hover:text-foreground">
              Jornada
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild size="sm" className="px-4 rounded-lg">
              <Link href={ctaHref}>Começar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="container relative pt-28 pb-16 text-center md:pt-48 md:pb-32 flex flex-col items-center">
          <FadeIn>
            <Badge variant="outline" className="mb-8 gap-2 py-1.5 px-3 border-white/10 bg-white/5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-nuk-green animate-pulse" />
              A nova casa dos criadores
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-8xl">
              Crie. Conecte. <br className="hidden md:block"/>
              <span className="text-gradient">Monetize.</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              O ecossistema definitivo para criadores de conteúdo e comunidades. 
              Tenha o controle total da sua audiência, sem depender de algoritmos.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col w-full max-w-sm sm:max-w-none sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-primary/25">
                <Link href={ctaHref}>
                  Criar minha conta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
          </FadeIn>
        </section>

        {/* RECURSOS */}
        <section id="recursos" className="container py-24 relative">
          {/* Subtle glow behind features */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
          
          <FadeIn className="mx-auto mb-16 max-w-2xl text-center relative z-10">
            <h2 className="font-display text-3xl font-bold sm:text-5xl tracking-tight">
              A fundação perfeita
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Inspirado no melhor do Discord, Substack e Patreon — reunidos
              em uma única experiência nativa, premium e ultra-rápida.
            </p>
          </FadeIn>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.05}>
                <div className="glass-strong group h-full rounded-[1.5rem] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-white/15">
                  <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-nuk-gradient text-white shadow-lg shadow-primary/20">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-display text-xl font-bold tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* FASES */}
        <section id="fases" className="container py-24 mb-10">
          <FadeIn className="mx-auto max-w-4xl">
            <div className="glass rounded-[2rem] p-8 text-center sm:p-16 border-white/5 relative overflow-hidden">
              {/* Highlight streak */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <h2 className="font-display text-3xl font-bold sm:text-5xl tracking-tight">
                Em construção
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Estamos operando na <strong className="text-foreground font-semibold">Fase 1 (MVP)</strong>. 
                Os primeiros usuários terão prioridade nos novos recursos e acessos premium vitalícios.
              </p>
              
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {[
                  "Fase 1: Social & Feed",
                  "Fase 2: Comunidades",
                  "Fase 3: Marketplace",
                  "Fase 4: Monetização",
                ].map((p, i) => (
                  <Badge key={p} variant={i === 0 ? "default" : "outline"} className={i !== 0 ? "border-white/10" : ""}>
                    {p}
                  </Badge>
                ))}
              </div>
              
              <Button asChild size="lg" className="mt-12 h-14 px-8 text-base">
                <Link href={ctaHref}>
                  Garantir meu acesso
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Núk. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
