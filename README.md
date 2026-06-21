<div align="center">

# nuk-plataforma 📱

**A plataforma social mobile para criar, conectar e crescer sua comunidade.**

[![Build Status](https://img.shields.io/badge/build-not_configured-lightgrey)](https://github.com/Mansonware/Nk-Plataforma/actions)
[![Version](https://img.shields.io/badge/version-0.1.0-blue)](./package.json)
[![License](https://img.shields.io/badge/license-MIT-purple)](https://opensource.org/license/mit)
[![Android](https://img.shields.io/badge/platform-Android-informational)](https://developer.android.com/)
[![iOS](https://img.shields.io/badge/platform-iOS-informational)](https://developer.apple.com/ios/)

</div>

---

## 🚀 Sobre o Projeto

O **nuk-plataforma** é uma plataforma social focada em conteúdo e comunidade, no estilo TikTok, Instagram e Facebook: feed dinâmico, interação entre usuários, descoberta de perfis e construção de audiência.

> Estado atual: base web/PWA com Next.js. Direção do produto: experiência mobile para Android e iOS.

---

## 🖼️ Screenshots

> Espaço reservado para imagens do app (adicione os prints reais da Play Store/iOS quando disponíveis).

- Home / Feed
- Perfil
- Mensagens
- Notificações

---

## ✨ Funcionalidades

- Feed social com posts e interações
- Perfil de usuário com dados públicos
- Curtidas, comentários e notificações
- Busca de usuários e conteúdos
- Seguidores e relacionamento entre perfis
- Mensagens privadas (em evolução)
- Autenticação (login/cadastro)

---

## 🧱 Tech Stack

- **TypeScript**
- **Next.js 15**
- **React 19**
- **TailwindCSS**
- **Prisma + PostgreSQL**
- **Auth.js (NextAuth)**

---

## ✅ Pré-requisitos

- Node.js 20+
- npm (ou yarn/pnpm)
- Banco PostgreSQL
- Android Studio (para fluxo Android)
- Xcode (para fluxo iOS, em macOS)

---

## 🛠️ Como rodar localmente

```bash
# 1) Clonar
git clone https://github.com/Mansonware/nuk-plataforma.git
cd nuk-plataforma

# 2) Variáveis de ambiente
cp .env.example .env

# 3) Instalar dependências
npm install

# 4) Banco de dados
npm run db:push
npm run db:seed   # opcional

# 5) Rodar em desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000`

---

## 📁 Estrutura de Pastas

```text
.
├── prisma/
├── public/
├── scripts/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── server/
│   └── types/
├── ARCHITECTURE.md
├── ROADMAP.md
└── TODO.md
```

---

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch (`feature/minha-feature`, `fix/meu-fix`, `chore/minha-tarefa`)
3. Commit suas alterações
4. Abra um Pull Request com contexto claro

Mais detalhes em [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 📄 Licença

Distribuído sob licença **MIT**.

---

## 👤 Contato / Autor

- GitHub: [@Mansonware](https://github.com/Mansonware)
- Repositório: [Mansonware/nuk-plataforma](https://github.com/Mansonware/nuk-plataforma)
