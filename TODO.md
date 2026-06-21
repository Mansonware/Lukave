# TODO — Núk

Lista de tarefas viva. A Fase 1 está concluída; o restante é backlog priorizado.

## ✅ Fase 1 — MVP (concluído)

### Infraestrutura
- [x] Scaffold Next.js 15 + TypeScript + Tailwind + design system
- [x] Prisma schema (Fase 1) + cliente singleton
- [x] Auth.js v5 (split edge/node, Credentials, JWT)
- [x] Middleware de proteção de rotas
- [x] Abstração de Storage (Supabase) com fallback em dev
- [x] Configuração segura do Stripe (sem fluxo de pagamento)
- [x] Envio de e-mail com degradação graciosa (log em dev)
- [x] Seed de desenvolvimento
- [x] Validação: typecheck, lint e build passando

### Contas
- [x] Cadastro com validação (Zod)
- [x] Login (Credentials)
- [x] Recuperação de senha (token persistido + reset)
- [x] Configurações da conta (perfil + troca de senha)

### Perfis
- [x] Foto, banner, bio, localização, website
- [x] Links sociais (twitter, instagram, youtube, tiktok, github)
- [x] Página pública `/[username]` com contadores

### Feed
- [x] Composer (texto + até 4 imagens + visibilidade)
- [x] Curtidas (otimistas)
- [x] Comentários (inline + página de detalhe)
- [x] Compartilhamentos (+ cópia de link)
- [x] Exclusão de publicação (autor/admin)

### Busca
- [x] Busca de usuários e conteúdos com abas
- [x] Sugestões de quem seguir

### Notificações
- [x] Curtidas, comentários, seguidores
- [x] Marcar todas como lidas + badge de não lidas

---

## ⬜ Próximos passos imediatos (pré-Fase 2)

- [ ] Paginação infinita no feed (cursor já existe em `getFeedPosts`)
- [ ] Rate limiting nas actions de escrita
- [ ] Testes: Vitest (unit/actions) + Playwright (e2e do fluxo de auth)
- [ ] OAuth Google/GitHub (modelos `Account` já preparados)
- [ ] Verificação de e-mail
- [ ] Integração real de e-mail (Resend/SMTP) em `lib/mail.ts`

## ⬜ Fase 2 — Social
- [ ] Stories (modelo + UI + expiração)
- [ ] Mensagens privadas (modelos + realtime)
- [ ] Feed inteligente / recomendações

## ⬜ Fase 3 — Comunidades
- [ ] Comunidades (públicas/privadas/assinatura)
- [ ] Eventos, enquetes, conteúdo fixado
- [ ] Moderação e denúncias

## ⬜ Fase 4 — Marketplace
- [ ] Produtos digitais + loja do criador
- [ ] Carrinho, checkout (Stripe), biblioteca

## ⬜ Fase 5 — Monetização
- [ ] Assinaturas (Stripe Billing) + webhooks
- [ ] Gorjetas
- [ ] Programa de criadores + ranking

## ⬜ Fase 6 — Expansão
- [ ] Lives e chamadas em grupo
- [ ] Recomendações por IA
- [ ] Gamificação (badges, conquistas, níveis)
