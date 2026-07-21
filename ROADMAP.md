<div align="center">
  <img src="./public/icon.svg" width="72" alt="Lukave" />

  # Roadmap — Lukave

  **Evolução planejada a partir do que já existe no código hoje.**

  <p>
    <a href="./README.md"><strong>README</strong></a>
    &nbsp;·&nbsp;
    <a href="./ARCHITECTURE.md">Arquitetura</a>
    &nbsp;·&nbsp;
    <a href="./TODO.md">Backlog</a>
  </p>
</div>

Legenda: ✅ concluído · 🟡 próximo ciclo · ⬜ planejado

---

## Capacidades já entregues (base atual)

| Área | Status | Escopo atual |
| --- | :---: | --- |
| Base social do MVP | ✅ | Contas, perfis, feed, comentários, curtidas, compartilhamentos, busca, seguidores e notificações. |
| Stories | ✅ | Modelo e ações com expiração de 24h (`Story`, `createStory`, `getActiveStories`). |
| Mensagens privadas 1:1 | ✅ | Conversas, membros, mensagens, leitura e atualização por polling. |
| Marketplace de produtos digitais | ✅ | Modelos `Product/Order/OrderItem/LibraryItem`, queries e actions de domínio. |
| Checkout Stripe | ✅ | Criação de sessão de pagamento (`createCheckoutSession`). |
| Webhook Stripe | ✅ | Processamento de `checkout.session.completed` e `checkout.session.expired`. |
| Biblioteca e download protegido | ✅ | Controle de posse e endpoint com URL assinada/fallback. |

---

## Próximos ciclos (incrementais)

### 🟡 Ciclo 1 — Social em tempo real e UX
- Realtime para mensagens (substituir/combinar com polling).
- Stories com ciclo de vida mais robusto (vídeo, visualização, limpeza operacional).
- Melhorias de descoberta no feed (ranking/sinais de relevância).

### 🟡 Ciclo 2 — Comunidades e moderação
- Espaços de comunidade (públicos, privados e por assinatura).
- Papéis e ferramentas de moderação.
- Fluxos de denúncia e governança de conteúdo.

### 🟡 Ciclo 3 — Monetização avançada
- Assinaturas com Stripe Billing e gestão de plano/ciclo de cobrança.
- Hardening de pagamentos (retries, reconciliação, antifraude e trilha operacional).
- Evolução de experiência do criador (ofertas e conversão).

---

## Melhorias transversais

- ⬜ Observabilidade (logs estruturados, tracing e alertas).
- ⬜ Testes ampliados (unit, integração e e2e cobrindo fluxos críticos).
- ⬜ Internacionalização (i18n).
- ⬜ OAuth social e verificação de e-mail (quando ativados no produto).
- ⬜ Evolução de performance (cache, paginação e tuning de queries).
