<div align="center">

# Lukave

**Crie, conecte e monetize em um só lugar.**

Plataforma social moderna para criadores de conteúdo, comunidades e futuras camadas de monetização, construída com Next.js, TypeScript e Prisma.

</div>

---

## Visão geral

O **Lukave** é uma plataforma web focada em presença digital, publicação de conteúdo e relacionamento com audiência. O projeto foi estruturado como um **monolito modular** com **Next.js 15 App Router**, priorizando produtividade, tipagem ponta a ponta e evolução em fases.

Hoje, o repositório já entrega a **Fase 1 (MVP)** com base sólida de autenticação, perfis, feed social, busca e notificações. As próximas expansões estão documentadas no [ROADMAP.md](./ROADMAP.md).

## Principais recursos

### MVP já implementado

- **Autenticação completa** com cadastro, login e recuperação de senha.
- **Perfis de usuário** com avatar, banner, bio, localização, website e links sociais.
- **Feed social** com publicações de texto e imagem.
- **Interações** com curtidas, comentários e compartilhamentos.
- **Busca** de usuários e conteúdos.
- **Sistema de seguidores** para conexão entre perfis.
- **Notificações** para eventos relevantes da plataforma.

### Estrutura preparada para evolução

O projeto já possui base técnica para futuras fases, incluindo:

- **Stories, mensagens privadas e feed inteligente**.
- **Comunidades públicas, privadas e por assinatura**.
- **Marketplace para produtos digitais**.
- **Assinaturas, gorjetas e monetização para criadores**.
- **Lives, recomendações por IA e gamificação**.

## Stack principal

- **Framework:** Next.js 15
- **Linguagem:** TypeScript
- **UI:** React 19, Tailwind CSS, Radix UI, Framer Motion
- **Autenticação:** Auth.js / NextAuth v5
- **Banco de dados:** PostgreSQL
- **ORM:** Prisma
- **Storage:** Supabase Storage
- **Pagamentos:** Stripe
- **Validação:** Zod
- **Testes:** Vitest

Para detalhes técnicos e decisões de arquitetura, veja [ARCHITECTURE.md](./ARCHITECTURE.md).

## Como executar localmente

### Pré-requisitos

- **Node.js 20+**
- **npm**
- **PostgreSQL** disponível localmente ou em provedor externo

### 1. Clone e instale dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Preencha pelo menos estas variáveis:

- `DATABASE_URL`
- `AUTH_SECRET`

Variáveis opcionais habilitam integrações extras, como Google/GitHub OAuth, Supabase Storage, Stripe, Resend e Upstash Redis.

### 3. Gere o banco e dados iniciais

```bash
npm run db:push
npm run db:seed
```

> O seed é opcional, mas útil para desenvolvimento local.

### 4. Inicie o ambiente de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em **http://localhost:3000**.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção |
| `npm run start` | Inicia a aplicação em modo produção |
| `npm run lint` | Executa o ESLint |
| `npm run typecheck` | Faz a checagem de tipos com TypeScript |
| `npm run test` | Executa os testes com Vitest |
| `npm run db:generate` | Gera o client do Prisma |
| `npm run db:push` | Sincroniza o schema com o banco |
| `npm run db:migrate` | Cria/aplica migrations no banco |
| `npm run db:studio` | Abre o Prisma Studio |
| `npm run db:seed` | Popula o banco com dados de exemplo |

## Estrutura do projeto

```text
prisma/
src/
  app/
  components/
  lib/
  server/
  types/
public/
scripts/
```

Arquivos úteis para navegação:

- [ARCHITECTURE.md](./ARCHITECTURE.md) — visão técnica e decisões de arquitetura.
- [ROADMAP.md](./ROADMAP.md) — fases futuras do produto.
- [TODO.md](./TODO.md) — backlog e melhorias planejadas.
- [`.env.example`](./.env.example) — referência de configuração local.

## Arquitetura em resumo

A aplicação segue uma abordagem de **monolito modular**:

- **React Server Components** para leituras.
- **Server Actions** para mutações.
- **Prisma** como camada de acesso a dados.
- **Auth.js v5** para autenticação.
- **Zod** para validação.
- **Supabase** e **Stripe** como integrações externas opcionais.

Essa estrutura favorece simplicidade operacional, boa experiência de desenvolvimento e crescimento incremental por fases.

## Status do projeto

- **Fase atual:** MVP implementado
- **Branch padrão:** `main`
- **Deploy/Homepage configurada:** GitHub Pages / ambiente publicado informado no repositório

## Próximos passos

Se você quiser evoluir o projeto, a ordem natural é:

1. reforçar testes automatizados;
2. habilitar rate limiting e observabilidade;
3. expandir a camada social;
4. ativar marketplace e monetização.

## Licença

Este repositório não possui uma licença definida no momento. Se o projeto for aberto para uso público mais amplo, vale adicionar uma licença explícita.
