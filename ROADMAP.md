# Roadmap — Núk

A plataforma é construída em 6 fases. A **Fase 1 (MVP)** está implementada.
As demais estão planejadas, com abstrações leves já preparadas no código.

Legenda: ✅ concluído · 🟡 em andamento · ⬜ planejado

---

## ✅ Fase 1 — MVP

Base social e de identidade da plataforma.

- ✅ **Contas**: cadastro, login, recuperação de senha (token persistido),
  configurações da conta, troca de senha.
- ✅ **Perfis**: foto, banner, bio, localização, website, links sociais.
- ✅ **Feed**: publicação de texto e imagem, curtidas, comentários,
  compartilhamentos (com cópia de link).
- ✅ **Busca**: usuários e conteúdos, com abas e debounce.
- ✅ **Notificações**: curtidas, comentários e novos seguidores.
- ✅ **Seguidores**: seguir / deixar de seguir (necessário para o feed e
  notificações já no MVP).

---

## ⬜ Fase 2 — Social

Aprofundar a camada social e o consumo de conteúdo.

- ⬜ **Stories**: imagens e vídeos curtos com expiração automática (24h).
  - Modelo `Story(authorId, mediaUrl, mediaType, expiresAt)` + job de limpeza.
- ⬜ **Mensagens**: chat privado 1:1 com envio de imagens.
  - Modelos `Conversation`, `ConversationMember`, `Message`.
  - Realtime via Supabase Realtime ou WebSocket.
- ⬜ **Feed inteligente**: conteúdos recomendados (sinais de engajamento +
  grafo de seguidores).

---

## ⬜ Fase 3 — Comunidades

- ⬜ Comunidades **públicas**, **privadas** e **por assinatura**.
  - Modelos `Community`, `CommunityMember` (papéis: OWNER/ADMIN/MOD/MEMBER).
- ⬜ Recursos internos: posts da comunidade, **eventos**, **enquetes**,
  conteúdo **fixado**.
- ⬜ **Moderação**: administradores, moderadores, **denúncias** (`Report`).

---

## ⬜ Fase 4 — Marketplace

Reaproveita o `lib/stripe.ts` já presente.

- ⬜ **Loja do criador**: produtos digitais.
  - Tipos: cursos, e-books, templates, prompts de IA, arquivos digitais.
  - Modelos `Product`, `Order`, `OrderItem`, `LibraryItem`.
- ⬜ Carrinho, checkout (Stripe Checkout), **biblioteca de compras**.
- ⬜ Entrega de arquivos via URLs assinadas do Supabase Storage.

---

## ⬜ Fase 5 — Monetização

- ⬜ **Assinaturas mensais** (planos Básico, Pro, Premium) via Stripe Billing.
  - Modelo `Subscription` + webhooks de status.
- ⬜ **Programa de criadores**: recompensa por engajamento, ranking.
- ⬜ **Gorjetas**: apoio financeiro direto (`Tip`).

---

## ⬜ Fase 6 — Expansão

- ⬜ **Lives** e **chamadas em grupo** (WebRTC / serviço de streaming).
- ⬜ **Recomendações por IA** (Claude) para feed e descoberta.
- ⬜ **Gamificação**: conquistas, badges, níveis e pontos.

---

## Dívidas técnicas / melhorias transversais

- Rate limiting (Upstash) em actions sensíveis.
- Paginação infinita no feed (cursor já suportado em `getFeedPosts`).
- Testes automatizados (Vitest + Playwright).
- Verificação de e-mail e OAuth (Google/GitHub) — modelos já preparados.
- Observabilidade (logs estruturados, Sentry).
- Internacionalização (i18n).
