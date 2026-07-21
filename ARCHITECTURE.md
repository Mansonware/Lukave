<div align="center">
  <img src="./public/icon.svg" width="72" alt="Lukave" />

  # Arquitetura — Lukave

  **Base técnica atual do produto, alinhada ao código do repositório.**

  <p>
    <a href="./README.md"><strong>README</strong></a>
    &nbsp;·&nbsp;
    <a href="./ROADMAP.md">Roadmap</a>
    &nbsp;·&nbsp;
    <a href="./TODO.md">Backlog</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/status-MVP%2B-22C55E?style=flat-square" alt="Status MVP+" />
    <img src="https://img.shields.io/badge/arquitetura-monolito%20modular-111827?style=flat-square" alt="Monolito modular" />
    <img src="https://img.shields.io/badge/Next.js-15-111827?style=flat-square&logo=nextdotjs" alt="Next.js 15" />
  </p>
</div>

---

## Visão geral

O **Lukave** é um monolito modular em **Next.js 15 (App Router)**:

- **Leituras:** React Server Components (RSC) com queries no servidor.
- **Mutações:** Server Actions com validação via Zod.
- **Dados:** Prisma como camada de acesso ao PostgreSQL.

```text
Browser / PWA
      │
      ├── React Server Components  →  consultas
      └── Server Actions           →  mutações validadas
                                      │
                              Prisma ORM + PostgreSQL
                                      │
          Auth.js · Supabase Storage · Stripe · Resend · Upstash (opcional)
```

## Stack atual

<div align="center">

| Interface | Aplicação | Dados e integrações |
| :---: | :---: | :---: |
| React 19 · Tailwind CSS · Radix UI · Framer Motion | Next.js 15 · App Router · Server Actions · Zod | PostgreSQL · Prisma · Auth.js · Supabase Storage · Stripe · Resend · Upstash |

</div>

## Estrutura do repositório

```text
prisma/                 # Schema, migrations e seed
src/
├── app/                # Rotas, layouts, páginas e APIs
│   └── api/
│       ├── webhooks/stripe/route.ts
│       └── library/[productId]/download/route.ts
├── auth.ts             # Auth.js runtime Node (Credentials + bcrypt)
├── auth.config.ts      # Config edge-safe usada no middleware
├── middleware.ts       # Proteção de rotas autenticadas
├── components/         # UI e componentes por domínio
├── lib/                # Clientes, sessão, validações e utilitários
└── server/
    ├── actions/        # Mutações (auth, posts, follow, stories, messages, products...)
    ├── queries.ts      # Queries principais de feed/perfil/marketplace/biblioteca
    └── queries/        # Queries específicas (ex.: mensagens)
```

## Modelo de dados (estado atual)

Além de contas/feed/notificações, o schema já inclui camadas sociais e de monetização:

- **Identidade e Auth:** `User`, `Account`, `Session`, `VerificationToken`, `PasswordResetToken`.
- **Social:** `Post`, `PostMedia`, `Comment`, `Like`, `Share`, `Follow`.
- **Stories:** `Story` com `expiresAt`.
- **Mensagens 1:1:** `Conversation`, `ConversationMember`, `Message`.
- **Marketplace:** `Product`, `Order`, `OrderItem`, `LibraryItem`.
- **Notificações:** `Notification` (inclui `PURCHASE`).

Referência: [`prisma/schema.prisma`](./prisma/schema.prisma).

## Fluxos implementados (resumo)

### Stories (24h)
- Criação por Server Action (`createStory`) com `expiresAt = now + 24h`.
- Leitura de stories ativos por `expiresAt > now` (`getActiveStories`).

### Mensagens privadas 1:1 (polling)
- Conversa criada/recuperada por `getOrCreateConversation`.
- Envio por `sendMessage` e marcação de leitura por `markConversationRead`.
- Atualização no cliente com polling periódico (~3s) em `ChatClient`.

### Marketplace + Checkout Stripe
- Produtos digitais modelados e validados por Zod.
- Checkout por `createCheckoutSession` com criação prévia de `Order`.
- Webhook `checkout.session.completed` marca pedido como `PAID` e libera item em `LibraryItem`.
- Webhook `checkout.session.expired` marca pedido como `FAILED`.

### Biblioteca e download protegido
- Biblioteca por `getUserLibrary`/`LibraryItem`.
- Endpoint `/api/library/[productId]/download` valida posse do item.
- Gera URL assinada no Supabase (5 min) e aplica fallback para URL pública quando necessário.

## Segurança e resiliência

- Senhas com **bcrypt** (`bcrypt.compare` no fluxo de login).
- Validação de entradas com **Zod** nas Server Actions.
- Proteção de rotas no `middleware.ts` + revalidação por `requireUser()`.
- Upload de imagem com limite de **8 MB** e allowlist (`jpeg/png/webp/gif`).
- Rate limiting opcional com **Upstash** (`src/lib/rate-limit.ts`), ativo só quando variáveis existem.
- Webhook Stripe validado por assinatura (`stripe-signature` + `STRIPE_WEBHOOK_SECRET`).
- Degradação graciosa:
  - sem Supabase configurado: placeholder em dev / erro controlado em produção;
  - sem Stripe configurado: checkout retorna erro explícito de indisponibilidade;
  - sem Resend: envio é logado localmente para desenvolvimento.

> Nota técnica: alguns identificadores internos ainda usam prefixo `nexus` por compatibilidade (ex.: fallback de bucket em `src/lib/supabase.ts` e prefixes de rate limit em `src/lib/rate-limit.ts`).

## Execução e validação

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed   # opcional
npm run dev
```

Validações usadas no projeto:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
