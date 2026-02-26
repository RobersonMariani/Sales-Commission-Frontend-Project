# Sales Commission Frontend

Frontend Vue.js para o sistema de gerenciamento de comissões de vendas.

## Stack

- **Vue 3** + Composition API (`<script setup>`)
- **TypeScript**
- **Vite** (bundler)
- **Pinia** (state management)
- **Vue Router** (rotas)
- **Zod** (validação de formulários)
- **Axios** (HTTP client)
- **Tailwind CSS 4** (estilização)
- **Vitest** (testes)

## Pré-requisitos

- Node.js 18+
- API rodando em `http://localhost:8000`

## Instalação

```bash
npm install
cp .env.example .env
```

## Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:5173`

## Build

```bash
npm run build
```

## Testes

```bash
npm run test        # watch mode
npm run test:run    # single run
```

## Estrutura

```
src/
├── assets/css/       # Tailwind CSS
├── components/
│   ├── ui/           # Componentes reutilizáveis (Button, Input, Card, etc.)
│   └── layout/       # Layout (Header, Sidebar, Notifications)
├── lib/              # Axios instance
├── pages/            # Páginas da aplicação
├── router/           # Vue Router config
├── schemas/          # Zod validation schemas
├── services/         # API services
├── stores/           # Pinia stores
└── types/            # TypeScript interfaces
```

## Funcionalidades

- Autenticação (login/registro) com JWT
- CRUD de vendedores
- Cadastro e listagem de vendas
- Filtro de vendas por vendedor
- Cálculo de comissão (8.5%)
- Reenvio de e-mail de comissão
- Dashboard com resumo
