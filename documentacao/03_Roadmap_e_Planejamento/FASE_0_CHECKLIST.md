# Fase 0 — Checklist de Início

> Execute na ordem. Cada item é um gate: não avance sem completar.

## 1. Repositório & Tooling

- [ ] Criar repositório no GitHub: `marcelle-platform`
- [ ] Inicializar com Turborepo: `npx create-turbo@latest`
- [ ] Configurar pnpm workspaces
- [ ] Adicionar apps: `web` (Next.js 15) e `api` (Fastify 5)
- [ ] Adicionar packages: `database`, `ui`, `email`, `validators`, `types`
- [ ] Configurar ESLint + Prettier compartilhado
- [ ] Configurar Husky + lint-staged + commitlint
- [ ] Criar `.env.example` com todas as variáveis

## 2. Infraestrutura de Dev

- [ ] Criar `infra/docker-compose.yml` (PostgreSQL 16 + Redis 7)
- [ ] Testar: `docker compose up -d` → banco e redis sobem
- [ ] Criar `infra/scripts/setup-dev.sh`

## 3. Banco de Dados

- [ ] Configurar package `database` com Prisma
- [ ] Criar `schema.prisma` completo (conforme DATABASE_SCHEMA.md)
- [ ] Rodar primeira migration: `pnpm db:migrate`
- [ ] Verificar no Prisma Studio
- [ ] Provisionar banco em produção (Supabase ou Railway)

## 4. CI/CD

- [ ] GitHub Actions: `ci.yml` (lint + typecheck + test em todo PR)
- [ ] Environments no GitHub: `staging` e `production`
- [ ] Secrets configurados no GitHub

## 5. Serviços Externos (Contas)

- [ ] Supabase (PostgreSQL) — criar projeto
- [ ] Upstash (Redis) — criar database
- [ ] Cloudflare R2 — criar bucket `marcelle-storage`
- [ ] Resend — criar conta e verificar domínio
- [ ] Pusher — criar app
- [ ] Sentry — criar projeto frontend e backend
- [ ] Vercel — conectar repositório (app `web`)
- [ ] Railway — conectar repositório (app `api`)

## 6. Verificação Final da Fase 0

- [ ] `pnpm dev` sobe web (porta 3000) e api (porta 3001) sem erro
- [ ] Health check da API: `GET /health` retorna `{ status: "ok" }`
- [ ] Banco conectado e acessível
- [ ] Todos os packages compilam sem erro TypeScript

**Gate:** Nenhum código de feature deve ser escrito antes desta fase estar 100% verde.
