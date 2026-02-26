# Sales Commission Frontend

Aplicação Vue.js para gerenciamento de vendas e comissões de vendedores, consumindo a [Sales Commission API](https://github.com/RobersonMariani/Sales-Commission-API-Project).

## Funcionalidades

- Autenticação JWT (registro, login, logout) com layout split-screen
- Dashboard com resumo geral de vendas e comissões
- CRUD de vendedores com pesquisa rápida por nome/e-mail
- Cadastro de vendas com taxa de comissão configurável (padrão 8,5%)
- Listagem de vendas com filtro por vendedor e paginação
- Reenvio manual de e-mail de comissão
- Validação de formulários em tempo real com Zod
- Máscara de moeda (R$) e percentual (%) nos inputs
- Notificações toast para feedback de ações
- Layout responsivo com sidebar e header

## Stack

| Camada          | Tecnologia                          |
|-----------------|-------------------------------------|
| Framework       | Vue 3 + Composition API             |
| Linguagem       | TypeScript 5.9                      |
| Bundler         | Vite 7                              |
| Estado          | Pinia 3                             |
| Rotas           | Vue Router 4                        |
| Validação       | Zod 4                               |
| HTTP Client     | Axios                               |
| Estilização     | Tailwind CSS 4                      |
| Testes          | Vitest + Vue Test Utils             |
| Lint / Format   | ESLint + Prettier                   |
| Containers      | Docker Compose                      |

## Requisitos

- Docker e Docker Compose
- API rodando em `http://localhost:8000` (ver [Sales-Commission-API-Project](https://github.com/RobersonMariani/Sales-Commission-API-Project))

## Instalação

### Com Docker (recomendado)

```bash
git clone https://github.com/RobersonMariani/Sales-Commission-Frontend-Project.git
cd Sales-Commission-Frontend-Project

# Subir a API primeiro (no diretório da API)
cd ../Sales-Commission-API-Project
docker compose up -d

# Voltar e subir o frontend com hot-reload
cd ../Sales-Commission-Frontend-Project
docker compose up
```

Acesse: `http://localhost:5173`

### Sem Docker

```bash
git clone https://github.com/RobersonMariani/Sales-Commission-Frontend-Project.git
cd Sales-Commission-Frontend-Project

npm install
cp .env.example .env
npm run dev
```

Acesse: `http://localhost:5173`

### Build de produção

```bash
# Com Docker
docker compose --profile prod up -d

# Sem Docker
npm run build
npm run preview
```

Acesse: `http://localhost:3000` (Docker) ou `http://localhost:4173` (preview)

## Serviços

| Serviço           | URL / Porta          | Descrição                                 |
|-------------------|----------------------|-------------------------------------------|
| Frontend (dev)    | http://localhost:5173 | Vite dev server com hot-reload            |
| Frontend (prod)   | http://localhost:3000 | Nginx servindo build estático             |
| API (dependência) | http://localhost:8000 | Laravel API (projeto separado)            |

---

## Páginas

| Rota              | Página           | Descrição                                        |
|-------------------|------------------|--------------------------------------------------|
| `/login`          | LoginPage        | Autenticação com e-mail e senha                  |
| `/register`       | RegisterPage     | Criação de conta com indicador de força de senha  |
| `/dashboard`      | DashboardPage    | Resumo geral de vendas e comissões               |
| `/sellers`        | SellersListPage  | Listagem de vendedores com pesquisa e paginação  |
| `/sellers/create` | CreateSellerPage | Cadastro de novo vendedor                        |
| `/sales`          | SalesListPage    | Listagem de vendas com filtro por vendedor        |
| `/sales/create`   | CreateSalePage   | Cadastro de venda com comissão configurável      |

---

## Componentes UI

| Componente         | Descrição                                             |
|--------------------|-------------------------------------------------------|
| `AppButton`        | Botão com variantes (primary, secondary, ghost, danger) e loading |
| `AppInput`         | Input com label, erro animado e suporte a tipos       |
| `AppSelect`        | Select customizado com placeholder e erro             |
| `AppCurrencyInput` | Input com máscara de moeda brasileira (R$)            |
| `AppPercentInput`  | Input com máscara de percentual (%) e limite 0-100    |
| `AppCard`          | Card container com padding opcional                   |
| `AppModal`         | Modal com overlay, animação e slot de conteúdo        |
| `AppPagination`    | Paginação com navegação e contagem de resultados      |
| `AppAlert`         | Alerta com variantes (success, warning, danger, info) |
| `AppLogo`          | Logo reutilizável com 3 tamanhos (sm, md, lg)         |

---

## Testes

```bash
# Watch mode (desenvolvimento)
npm run test

# Execução única
npm run test:run

# Com cobertura
npm run test:coverage
```

## Qualidade de Código

```bash
# Lint (ESLint + correção automática)
npm run lint

# Formatação (Prettier)
npm run format

# Type check (TypeScript)
npx vue-tsc --noEmit
```

## Variáveis de Ambiente

| Variável        | Descrição          | Valor Padrão              |
|-----------------|--------------------|---------------------------|
| `VITE_API_URL`  | URL base da API    | `http://localhost:8000`   |

## Arquitetura

O projeto segue uma **arquitetura modular por responsabilidade**, separando claramente as camadas de UI, estado, validação e comunicação com a API:

```
src/
├── assets/css/          → Tailwind CSS com tema customizado (cores, fontes)
├── components/
│   ├── ui/              → Componentes reutilizáveis (Button, Input, Card, Logo, etc.)
│   └── layout/          → Layout da aplicação (Header, Sidebar, Notifications)
├── composables/         → Composables Vue (useFormValidation)
├── lib/                 → Axios instance com interceptors JWT e 401
├── pages/
│   ├── auth/            → Login e Registro
│   ├── dashboard/       → Dashboard com resumo
│   ├── sellers/         → Listagem e cadastro de vendedores
│   └── sales/           → Listagem e cadastro de vendas
├── router/              → Vue Router com guards de autenticação
├── schemas/             → Schemas Zod para validação de formulários
├── services/            → Serviços de API (authService, sellerService, saleService)
├── stores/              → Pinia stores (auth, seller, sale, notification)
└── types/               → Interfaces TypeScript (User, Seller, Sale, Pagination)
```

### Fluxo de uma ação do usuário

```
Página → Schema (validação Zod) → Service (chamada API via Axios) → Store (estado Pinia) → UI (reatividade Vue)
```

## Estrutura Docker

```
.docker/
├── Dockerfile           → Multi-stage: Node (build) + Nginx (produção)
└── nginx/
    └── default.conf     → Proxy reverso /api → API Laravel + SPA fallback
```

| Container             | Descrição                                      |
|-----------------------|------------------------------------------------|
| `sales-frontend-dev`  | Node 22 Alpine — Vite dev server com hot-reload |
| `sales-frontend`      | Nginx — build estático para produção           |
