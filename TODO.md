<div align="center">
  <img src="./public/icon.svg" width="72" alt="Lukave" />

  # Backlog — Lukave

  **Lista viva de evolução, mantendo somente o que faz sentido com o estado atual do código.**

  <p>
    <a href="./README.md"><strong>README</strong></a>
    &nbsp;·&nbsp;
    <a href="./ARCHITECTURE.md">Arquitetura</a>
    &nbsp;·&nbsp;
    <a href="./ROADMAP.md">Roadmap</a>
  </p>
</div>

---

## ✅ Entregue no código

### Fundação social
- [x] Auth.js v5 com credenciais e sessões JWT
- [x] Feed com posts, curtidas, comentários e compartilhamentos
- [x] Busca, seguidores e notificações

### Expansões já presentes
- [x] Stories com expiração de 24h
- [x] Mensagens privadas 1:1 com polling
- [x] Marketplace de produtos digitais (modelos, queries e actions)
- [x] Checkout Stripe
- [x] Webhook Stripe para confirmação/expiração de pedido
- [x] Biblioteca de compras
- [x] Download protegido com URL assinada/fallback
- [x] Rate limiting opcional com Upstash em ações sensíveis

---

## 🟡 Próximo ciclo (alta prioridade)

- [ ] Realtime para mensagens (WebSocket/Supabase Realtime)
- [ ] Robustecer stories (suporte operacional completo para vídeo, métricas e ciclo de vida)
- [ ] Cobertura de testes para fluxos de mensagens, marketplace e webhook
- [ ] Hardening de pagamentos (idempotência ampliada, reconciliação e monitoramento)

## 🟡 Ciclo seguinte (produto)

- [ ] Comunidades (públicas, privadas e por assinatura)
- [ ] Moderação e denúncias
- [ ] Assinaturas com Stripe Billing
- [ ] Melhorias de descoberta/recomendação no feed

## ⬜ Melhorias transversais

- [ ] Observabilidade (logs estruturados, métricas e alertas)
- [ ] Internacionalização (i18n)
- [ ] OAuth Google/GitHub (ativação de providers)
- [ ] Verificação de e-mail
- [ ] Estratégia de testes e2e mais ampla
