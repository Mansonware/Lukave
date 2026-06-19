<div align="center">

# NEXUS

**Crie. Conecte. Monetize.**

A plataforma tudo-em-um para criadores de conteúdo, comunidades e monetização.

</div>

---

## Sobre

NEXUS permite que qualquer pessoa **crie conteúdo**, **construa audiência**,
**forme comunidades** e **monetize** — tudo em um só lugar, sem depender de
ferramentas externas. Inspirado no melhor de Discord, TikTok e Patreon, com
visual premium e dark mode por padrão.

> **Status:** Fase 1 (MVP) implementada e validada. Veja o
> [ROADMAP](./ROADMAP.md) para as próximas fases.

## Stack

Next.js 15 · TypeScript · TailwindCSS · shadcn-style UI · Framer Motion ·
Prisma · PostgreSQL · Auth.js v5 · Supabase Storage · Stripe.

Detalhes em [ARCHITECTURE.md](./ARCHITECTURE.md).

## Funcionalidades (Fase 1 — MVP)

- **Contas**: cadastro, login, recuperação de senha, configurações.
- **Perfis**: foto, banner, bio, localização, website e links sociais.
- **Feed**: posts de texto e imagem, curtidas, comentários, compartilhamentos.
- **Busca**: usuários e conteúdos.
- **Notificações**: curtidas, comentários e novos seguidores.
- **Seguidores**: seguir / deixar de seguir.

## Como rodar

Pré-requisitos: Node 20+ e um banco PostgreSQL.

```bash
# 1. Variáveis de ambiente
cp .env.example .env
#    Preencha pelo menos DATABASE_URL e AUTH_SECRET (openssl rand -base64 32)

# 2. Dependências
npm install

# 3. Banco de dados
npm run db:push      # cria as tabelas
npm run db:seed      # (opcional) popula dados de exemplo

# 4. Desenvolvimento
npm run dev
```

App em `http://localhost:3000`.
Login de teste (após o seed): `ana@nexus.app` / `nexus1234`.

## Scripts

| Script               | Descrição                          |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento        |
| `npm run build`      | Build de produção (+ prisma generate) |
| `npm run start`      | Servidor de produção               |
| `npm run lint`       | ESLint                             |
| `npm run typecheck`  | Checagem de tipos (tsc)            |
| `npm run db:push`    | Sincroniza o schema com o banco    |
| `npm run db:migrate` | Cria/aplica migrations             |
| `npm run db:seed`    | Popula dados de exemplo            |
| `npm run db:studio`  | Prisma Studio                      |

## Variáveis de ambiente

Veja [`.env.example`](./.env.example). Mínimo para rodar a Fase 1:

- `DATABASE_URL` — conexão PostgreSQL.
- `AUTH_SECRET` — segredo do Auth.js.

Opcionais (degradam graciosamente se ausentes):

- Supabase (upload de mídia) — sem isso, usa placeholder em dev.
- Stripe (fases 4/5) — sem isso, pagamentos ficam desativados.
- SMTP (recuperação de senha) — sem isso, o link é logado no console.

## Documentação

- [ARCHITECTURE.md](./ARCHITECTURE.md) — arquitetura e decisões técnicas.
- [ROADMAP.md](./ROADMAP.md) — fases e planejamento.
- [TODO.md](./TODO.md) — backlog de tarefas.
