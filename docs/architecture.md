# NEXUS — Arquitetura Técnica

## Visão geral

NEXUS é uma plataforma social de criadores com feed, comunidades, vídeos curtos e longos, mensagens e monetização. A arquitetura foi desenhada para começar simples (MVP) e escalar de forma controlada.

---

## Camadas da stack

### 1. PostgreSQL — Dados relacionais
**Onde:** Supabase (managed PostgreSQL)  
**O que armazena:**
- Usuários, perfis, seguidores
- Posts, comentários, likes, compartilhamentos
- Stories, conversas, mensagens
- Notificações
- Metadados de mídia (referências, não binários)

**Decisão:** O banco armazena apenas ponteiros para arquivos (`url`, `key`, `bucket`). Nenhum binário vai para o PostgreSQL.

---

### 2. Cloudflare R2 — Armazenamento de arquivos
**Status atual:** Preparado, não ativado em produção  
**O que armazena:**
- Fotos de posts e stories
- Avatares e banners de perfil
- Vídeos curtos (SHORT_VIDEO) e longos (LONG_VIDEO)
- Capas de comunidades

**Como funciona:**
1. O servidor gera uma presigned URL via `src/lib/r2.ts`
2. O cliente faz PUT direto ao R2 (o servidor nunca toca no binário)
3. Após upload confirmado, o servidor salva os metadados em `MediaAsset`

**Vantagens sobre Supabase Storage:**
- Custo de egress zero (R2 não cobra saída de dados)
- CDN global via Cloudflare
- Ideal para vídeos grandes

**Variáveis necessárias:**
```
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_URL
```

**Para ativar:** Configurar as variáveis acima no `.env.local`/produção e chamar `generateR2UploadUrl()` de `src/lib/r2.ts`.

---

### 3. Redis (Upstash) — Cache e rate limiting
**Status atual:** Configurado para rate limiting. Camada de cache preparada em `src/lib/cache.ts`.  
**O que cacheia:**

| Chave                    | TTL  | Conteúdo                         |
|--------------------------|------|----------------------------------|
| `feed:home:{userId}`     | 30s  | Feed paginado do usuário         |
| `trending:posts`         | 5min | Posts em alta                    |
| `trending:videos`        | 5min | Vídeos em alta                   |
| `post:stats:{postId}`    | 60s  | Contadores do post               |

**Variáveis necessárias:**
```
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

---

### 4. Modelo MediaAsset — Referência de arquivo
Toda mídia enviada gera um registro em `MediaAsset`:

```prisma
model MediaAsset {
  provider        String    // "r2" | "supabase" | "external"
  bucket          String?
  key             String?   // caminho no bucket
  url             String    // URL pública
  mimeType        String
  sizeBytes       Int?
  width           Int?
  height          Int?
  durationSeconds Int?      // vídeos
  ownerId         String
}
```

`PostMedia` e `Story` têm campo `mediaAssetId` opcional — a migração gradual permite que posts legados continuem funcionando.

---

## Fases futuras (planejadas, não implementadas)

### NestJS — Backend dedicado
**Quando:** Fase 3+ quando Next.js Server Actions não forem suficientes para carga.  
**Responsabilidades:** API REST/GraphQL, jobs assíncronos, WebSockets para mensagens em tempo real.  
**Não migrar agora:** Next.js Server Actions são suficientes para o MVP.

### Flutter — App nativo
**Quando:** Após validação de produto com PWA/TWA.  
**Motivo:** App nativo para Play Store e App Store com melhor performance de câmera/vídeo.  
**Não implementar agora:** PWA + TWA cobre o lançamento inicial.

### Meilisearch / Elasticsearch — Busca full-text
**Quando:** Base de usuários crescer e busca por posts/perfis tornar-se crítica.  
**Não implementar agora:** `ILIKE` no PostgreSQL é suficiente para MVP.

---

## Decisões de arquitetura

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| ORM | Prisma | Type-safe, migrations declarativas |
| Auth | Auth.js v5 (next-auth beta) | Suporte a Next.js App Router |
| Storage atual | Supabase Storage | Zero-config para MVP |
| Storage futuro | Cloudflare R2 | Custo de egress zero, CDN global |
| Cache | Upstash Redis | Serverless, sem infra adicional |
| Deploy | Vercel + Supabase | Stack managed para MVP |

---

## Estrutura de pastas relevante

```
src/
  lib/
    prisma.ts      — cliente Prisma singleton
    supabase.ts    — cliente Supabase (atual storage)
    r2.ts          — serviço R2 (storage futuro)
    cache.ts       — camada de cache Redis
    rate-limit.ts  — rate limiting com Upstash
  server/
    actions/       — Server Actions (posts, stories, auth, upload...)
    queries.ts     — queries compartilhadas
prisma/
  schema.prisma    — schema único da aplicação
docs/
  architecture.md  — este arquivo
```
