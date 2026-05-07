# Setup — Marcelle Platform

## Pré-requisitos

- Node.js >= 22
- pnpm >= 9 (`brew install pnpm`)
- Docker Desktop (para PostgreSQL e Redis local) — https://www.docker.com/products/docker-desktop/
- OU: PostgreSQL e Redis rodando localmente

## Setup inicial (primeira vez)

```bash
# 1. Instalar dependências
pnpm install

# 2. Subir banco de dados e Redis (requer Docker Desktop)
docker compose -f infra/docker-compose.yml up -d

# 3. Gerar o Prisma Client
pnpm db:generate

# 4. Rodar migrations
pnpm db:migrate

# 5. Popular banco com dados iniciais
pnpm db:seed

# 6. Rodar em desenvolvimento
pnpm dev
```

## URLs

| Serviço | URL |
|---------|-----|
| Web (Next.js) | http://localhost:3000 |
| API (Fastify) | http://localhost:3001 |
| API Health | http://localhost:3001/health |
| Prisma Studio | http://localhost:5555 (via `pnpm db:studio`) |

## Credenciais de Desenvolvimento

| Usuário | Email | Senha | Role |
|---------|-------|-------|------|
| Marcelle (Super Admin) | marcellebreciani@gmail.com | marcelle@2025! | SUPER_ADMIN |
| Cliente Demo | cliente@demo.com | cliente@demo123 | CLIENT |

## Sem Docker?

Se não tiver Docker, instale PostgreSQL e Redis localmente:

```bash
# PostgreSQL
brew install postgresql@16
brew services start postgresql@16
createdb marcelle_db

# Redis
brew install redis
brew services start redis
```

E ajuste `apps/api/.env`:
```env
DATABASE_URL="postgresql://[seu-user]@localhost:5432/marcelle_db"
```

## Comandos úteis

```bash
pnpm dev              # Sobe todos os apps
pnpm typecheck        # Verifica tipos em todo o monorepo
pnpm lint             # Linta todo o monorepo
pnpm db:studio        # Abre GUI do banco
pnpm db:reset         # Reset completo do banco (dev only)
```
