# Arquitetura — NEXUS

NEXUS é uma plataforma tudo-em-um para criadores de conteúdo, comunidades e
monetização. Este documento descreve a arquitetura técnica, as decisões de
projeto e como o sistema evolui ao longo das fases.

> **Status atual:** Fase 1 (MVP) implementada. Fases 2–6 documentadas como
> roadmap, com abstrações leves já preparadas (`lib/stripe.ts`, `lib/supabase.ts`).

---

## 1. Visão geral

NEXUS é um **monolito modular** construído com **Next.js 15 (App Router)**. Não
há uma API REST separada: as leituras acontecem em **React Server Components
(RSC)** consultando o banco via Prisma, e as escritas são feitas por
**Server Actions** tipadas e validadas com Zod.

```
┌──────────────────────────────────────────────────────────────┐
│  Cliente (Browser / PWA)                                       │
│  - RSC renderizados no servidor                                │
│  - Client Components ("use client") p/ interatividade          │
│  - Framer Motion (animações), Sonner (toasts)                  │
└───────────────┬───────────────────────────┬──────────────────┘
                │ Server Actions (mutações)  │ RSC (queries)
┌───────────────▼───────────────────────────▼──────────────────┐
│  Camada de aplicação (src/server, src/lib)                    │
│  - Actions: auth, posts, follow, profile, notifications, upload│
│  - Queries: feed, perfil, busca, notificações                 │
│  - Validação: Zod (src/lib/validations.ts)                    │
│  - Sessão: Auth.js v5 (src/auth.ts + src/lib/session.ts)     │
└───────────────┬───────────────────────────┬──────────────────┘
                │ Prisma Client (singleton)  │
┌───────────────▼──────────┐  ┌──────────────▼──────────────────┐
│  PostgreSQL              │  │  Serviços externos               │
│  (Prisma ORM)           │  │  - Supabase Storage (mídia)      │
│                          │  │  - Stripe (pagamentos, fases 4/5)│
└──────────────────────────┘  └──────────────────────────────────┘
```

---

## 2. Stack

| Camada         | Tecnologia                                   |
| -------------- | -------------------------------------------- |
| Framework      | Next.js 15 (App Router, RSC, Server Actions) |
| Linguagem      | TypeScript (strict)                          |
| Estilo         | TailwindCSS + design system shadcn-style     |
| Animações      | Framer Motion                                |
| UI primitives  | Radix UI                                     |
| ORM            | Prisma                                       |
| Banco          | PostgreSQL                                    |
| Autenticação   | NextAuth / Auth.js v5 (estratégia JWT)       |
| Storage        | Supabase Storage                             |
| Pagamentos     | Stripe (configuração; fluxo nas fases 4/5)   |
| Notificações UI| Sonner                                       |

---

## 3. Estrutura de pastas

```
prisma/
  schema.prisma          # Modelo de dados (Fase 1)
  seed.ts                # Dados de exemplo para desenvolvimento
src/
  app/
    (auth)/              # Grupo de rotas públicas (login, registro, senha)
    (app)/               # Grupo de rotas autenticadas (shell + features)
      feed/  explore/  notifications/  settings/
      [username]/        # Perfil público
      post/[id]/         # Detalhe da publicação
    api/auth/[...nextauth]/  # Handler do Auth.js
    layout.tsx  globals.css  manifest.ts  not-found.tsx  page.tsx (landing)
  auth.ts                # Auth.js (runtime Node: Credentials + bcrypt)
  auth.config.ts         # Config edge-safe (usada no middleware)
  middleware.ts          # Proteção de rotas
  components/
    ui/                  # Design system (Button, Input, Card, Dialog, ...)
    auth/  feed/  layout/  profile/  search/  settings/  notifications/
    brand/  motion/  providers.tsx
  lib/
    prisma.ts  session.ts  validations.ts
    supabase.ts  stripe.ts  mail.ts  utils.ts
  server/
    action-result.ts     # Tipo ActionResult compartilhado
    queries.ts           # Leituras (RSC)
    actions/             # Server Actions (mutações)
  types/                 # Tipos compartilhados + augmentation do next-auth
```

---

## 4. Decisões de arquitetura

### 4.1 Server Actions em vez de API REST
Mutações são funções `"use server"` chamadas diretamente dos componentes. Ganhos:
tipagem ponta-a-ponta, menos boilerplate, revalidação de cache integrada
(`revalidatePath`). Toda action retorna um `ActionResult<T>` padronizado.

### 4.2 Auth.js v5 com split de configuração
- `auth.config.ts` é **edge-safe** (sem Prisma/bcrypt) e usado pelo
  `middleware.ts` para proteger rotas.
- `auth.ts` roda em **runtime Node**, adiciona o provider `Credentials` com
  `bcrypt.compare` e expõe `handlers/auth/signIn/signOut`.
- Estratégia de sessão **JWT** (sem tabela de sessão obrigatória), com
  `id/username/role` injetados no token e na sessão.

Isso evita o erro clássico de usar bcrypt no Edge Runtime.

### 4.3 Contadores desnormalizados
`likesCount`, `commentsCount`, `sharesCount`, `followersCount`, etc. são mantidos
na escrita (dentro de transações Prisma). Trade-off conhecido: leitura de feed
rápida em troca de manutenção na escrita. Em escala, um job de reconciliação
pode corrigir divergências.

### 4.4 UI otimista
Curtidas, compartilhamentos e comentários atualizam o estado local
imediatamente e revertem em caso de erro da action — percepção de app nativo.

### 4.5 Storage com degradação graciosa
`lib/supabase.ts` só cria o cliente se as variáveis existirem. A action
`uploadImage` falha de forma controlada em produção e, em desenvolvimento,
retorna um placeholder determinístico (DiceBear) para não travar o fluxo.

### 4.6 Stripe apenas configurado
`lib/stripe.ts` expõe um singleton seguro (`null` se não configurado). Nenhum
fluxo de checkout/assinatura é implementado no MVP — isso entra nas Fases 4 e 5.

### 4.7 Recuperação de senha
Token aleatório de 32 bytes persistido em `PasswordResetToken` (expira em 1h).
O e-mail é enviado por `lib/mail.ts`; sem SMTP configurado, o link é **logado no
console** (dev). Resposta idêntica exista ou não o e-mail (anti-enumeração).
Integração futura: trocar `sendEmail` por Resend/SES/SMTP.

---

## 5. Modelo de dados (Fase 1)

Entidades implementadas: `User`, `Account`, `Session`, `VerificationToken`,
`PasswordResetToken`, `Post`, `PostMedia`, `Comment`, `Like`, `Share`,
`Follow`, `Notification`.

Decisão deliberada: **não** modelar antecipadamente Stories, Mensagens,
Comunidades, Marketplace, Assinaturas e Gamificação, evitando tabelas sem uso.
Cada fase adiciona seus modelos via migration própria. A única antecipação são
os modelos padrão do Auth.js (`Account`/`Session`/`VerificationToken`), incluídos
para que habilitar OAuth no futuro não exija migration destrutiva.

Veja o schema completo em [`prisma/schema.prisma`](./prisma/schema.prisma).

---

## 6. Segurança

- Senhas com `bcrypt` (custo 12).
- Validação de entrada com Zod em todas as actions.
- Rotas autenticadas protegidas no `middleware.ts` e revalidadas em cada action
  com `requireUser()`.
- Anti-enumeração de e-mail na recuperação de senha.
- Limite de upload (8MB) e allowlist de tipos de imagem.
- `force-dynamic` nas rotas autenticadas (sem cache de dados sensíveis).

**Melhorias planejadas:** rate limiting (Upstash), verificação de e-mail,
2FA, CSP estrita, e auditoria de moderação (Fase 3).

---

## 7. Como rodar

```bash
cp .env.example .env      # preencha DATABASE_URL e AUTH_SECRET
npm install
npm run db:push           # cria as tabelas no Postgres
npm run db:seed           # (opcional) popula dados de exemplo
npm run dev
```

Validação: `npm run typecheck`, `npm run lint`, `npm run build`.
