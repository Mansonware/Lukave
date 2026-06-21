# Contribuindo com o nuk-plataforma 🤝

Obrigado por contribuir com o projeto!

## 1) Fork e clone

```bash
# Faça fork no GitHub e depois clone seu fork
git clone https://github.com/SEU-USUARIO/nuk-plataforma.git
cd nuk-plataforma
npm install
```

## 2) Padrão de branches

Use sempre nomes claros:

- `feature/nome-da-feature`
- `fix/nome-do-ajuste`
- `chore/nome-da-tarefa`

Exemplo:

```bash
git checkout -b feature/feed-infinito
```

## 3) Rodar o projeto

```bash
cp .env.example .env
npm run db:push
npm run dev
```

Validação antes de abrir PR:

```bash
npm run lint
npm run typecheck
npm run build
```

## 4) Abrir Pull Request

Antes de abrir PR:

- Garanta que sua branch está atualizada com a principal
- Explique claramente o problema e a solução
- Inclua passos de teste
- Anexe screenshots quando houver mudança visual

## 5) Code style / boas práticas TypeScript

- Use tipagem explícita quando necessário
- Evite `any` sem justificativa
- Prefira funções pequenas e com responsabilidade única
- Reutilize utilitários/componentes existentes
- Não introduza código morto ou dependências desnecessárias
- Mantenha consistência com ESLint e padrões do projeto
