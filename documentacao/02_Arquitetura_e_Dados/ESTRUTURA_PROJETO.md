# Estrutura de Pastas — Marcelle Platform

> Monorepo com Turborepo + pnpm workspaces.
> Stack enterprise senior — Next.js 15 + Fastify 5 + Prisma + PostgreSQL.

```
marcelle-platform/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Lint + Type check + Tests em todo PR
│   │   ├── deploy-web.yml      # Deploy Vercel (main branch)
│   │   └── deploy-api.yml      # Deploy Railway (main branch)
│   └── pull_request_template.md
│
├── apps/
│   │
│   ├── web/                    # Next.js 15 — Interface Admin + Cliente
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── layout.tsx
│   │   │   │   │
│   │   │   │   ├── (admin)/            # Layout admin (role guard)
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── clientes/
│   │   │   │   │   │   ├── page.tsx        # Lista de clientes
│   │   │   │   │   │   ├── novo/
│   │   │   │   │   │   │   └── page.tsx    # Criar cliente
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       ├── page.tsx    # Perfil do cliente
│   │   │   │   │   │       ├── anamnese/
│   │   │   │   │   │       │   └── page.tsx
│   │   │   │   │   │       ├── plano/
│   │   │   │   │   │       │   └── page.tsx
│   │   │   │   │   │       └── tarefas/
│   │   │   │   │   │           └── page.tsx
│   │   │   │   │   ├── conteudo/
│   │   │   │   │   │   ├── page.tsx        # Gestão de trilhas e materiais
│   │   │   │   │   │   ├── trilhas/
│   │   │   │   │   │   │   └── [id]/
│   │   │   │   │   │   │       └── page.tsx
│   │   │   │   │   │   └── novo/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── equipe/
│   │   │   │   │   │   └── page.tsx        # Gestão de colaboradores
│   │   │   │   │   └── layout.tsx          # Sidebar admin
│   │   │   │   │
│   │   │   │   ├── (cliente)/          # Layout cliente (role guard)
│   │   │   │   │   ├── inicio/
│   │   │   │   │   │   └── page.tsx        # Dashboard cliente
│   │   │   │   │   ├── meu-plano/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── tarefas/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── aprender/
│   │   │   │   │   │   ├── page.tsx        # Hub educacional
│   │   │   │   │   │   └── [trackSlug]/
│   │   │   │   │   │       ├── page.tsx    # Trilha
│   │   │   │   │   │       └── [contentId]/
│   │   │   │   │   │           └── page.tsx # Material
│   │   │   │   │   ├── anamnese/
│   │   │   │   │   │   └── page.tsx        # Preencher anamnese
│   │   │   │   │   └── layout.tsx          # Bottom nav cliente (mobile)
│   │   │   │   │
│   │   │   │   ├── api/
│   │   │   │   │   └── auth/
│   │   │   │   │       └── [...nextauth]/
│   │   │   │   │           └── route.ts
│   │   │   │   │
│   │   │   │   ├── layout.tsx          # Root layout
│   │   │   │   └── globals.css
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── ClientCard.tsx
│   │   │   │   │   ├── TaskForm.tsx
│   │   │   │   │   ├── PlanEditor.tsx
│   │   │   │   │   ├── AnamnesisBuilder.tsx
│   │   │   │   │   └── LifecycleSelector.tsx
│   │   │   │   ├── client/
│   │   │   │   │   ├── TaskItem.tsx
│   │   │   │   │   ├── TaskQuestion.tsx
│   │   │   │   │   ├── PlanView.tsx
│   │   │   │   │   ├── TrackCard.tsx
│   │   │   │   │   └── ProgressRing.tsx
│   │   │   │   └── shared/
│   │   │   │       ├── NotificationBell.tsx
│   │   │   │       ├── NotificationList.tsx
│   │   │   │       ├── UserAvatar.tsx
│   │   │   │       └── EmptyState.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useNotifications.ts
│   │   │   │   ├── usePushSubscription.ts
│   │   │   │   ├── useTasks.ts
│   │   │   │   └── useClientProgress.ts
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   ├── auth.ts             # NextAuth config
│   │   │   │   ├── api-client.ts       # Typed API client (fetch wrapper)
│   │   │   │   └── push.ts             # Web Push utilities
│   │   │   │
│   │   │   ├── middleware.ts           # Route protection por role
│   │   │   └── auth.config.ts
│   │   │
│   │   ├── public/
│   │   │   ├── manifest.json           # PWA manifest
│   │   │   ├── sw.js                   # Service Worker
│   │   │   └── icons/                  # PWA icons
│   │   │
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── api/                    # Fastify 5 — REST API
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.routes.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   └── auth.schema.ts
│       │   │   ├── clients/
│       │   │   │   ├── clients.routes.ts
│       │   │   │   ├── clients.service.ts
│       │   │   │   └── clients.schema.ts
│       │   │   ├── anamnesis/
│       │   │   │   ├── anamnesis.routes.ts
│       │   │   │   ├── anamnesis.service.ts
│       │   │   │   └── anamnesis.schema.ts
│       │   │   ├── plans/
│       │   │   │   ├── plans.routes.ts
│       │   │   │   ├── plans.service.ts
│       │   │   │   └── plans.schema.ts
│       │   │   ├── tasks/
│       │   │   │   ├── tasks.routes.ts
│       │   │   │   ├── tasks.service.ts
│       │   │   │   └── tasks.schema.ts
│       │   │   ├── content/
│       │   │   │   ├── content.routes.ts
│       │   │   │   ├── content.service.ts
│       │   │   │   └── content.schema.ts
│       │   │   └── notifications/
│       │   │       ├── notifications.routes.ts
│       │   │       ├── notifications.service.ts
│       │   │       └── push.worker.ts     # BullMQ worker
│       │   │
│       │   ├── plugins/
│       │   │   ├── auth.plugin.ts      # JWT verification
│       │   │   ├── cors.plugin.ts
│       │   │   ├── rate-limit.plugin.ts
│       │   │   └── sentry.plugin.ts
│       │   │
│       │   ├── lib/
│       │   │   ├── prisma.ts           # Prisma client singleton
│       │   │   ├── redis.ts            # Redis client (BullMQ)
│       │   │   ├── storage.ts          # Cloudflare R2 client
│       │   │   ├── email.ts            # Resend client
│       │   │   └── push.ts             # Web Push (VAPID)
│       │   │
│       │   └── app.ts                  # Fastify instance + plugins
│       │
│       ├── tests/
│       │   ├── integration/
│       │   │   ├── tasks.test.ts
│       │   │   ├── clients.test.ts
│       │   │   └── auth.test.ts
│       │   └── unit/
│       │       └── tasks.service.test.ts
│       │
│       └── package.json
│
├── packages/
│   │
│   ├── database/               # Prisma — Schema + Migrations + Seed
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed/
│   │   │       ├── index.ts            # Seed runner
│   │   │       ├── tracks.seed.ts      # 8 trilhas + 40 materiais
│   │   │       ├── anamnesis.seed.ts   # Template de anamnese padrão
│   │   │       └── demo-client.seed.ts # Cliente demo para testes
│   │   ├── src/
│   │   │   └── index.ts               # Re-export Prisma client + types
│   │   └── package.json
│   │
│   ├── ui/                     # Design System (shadcn customizado)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Progress.tsx
│   │   │   │   ├── TaskCard.tsx        # Componente específico de tarefa
│   │   │   │   └── TrackProgress.tsx   # Progresso de trilha
│   │   │   └── tokens/
│   │   │       └── colors.ts           # Tokens de cor Marcelle
│   │   └── package.json
│   │
│   ├── email/                  # Templates React Email
│   │   ├── src/
│   │   │   ├── templates/
│   │   │   │   ├── WelcomeEmail.tsx
│   │   │   │   ├── NewTaskEmail.tsx
│   │   │   │   ├── TaskDueEmail.tsx
│   │   │   │   ├── QuestionAnsweredEmail.tsx
│   │   │   │   └── PlanUpdatedEmail.tsx
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── validators/             # Schemas Zod compartilhados
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── task.ts
│   │   │   ├── plan.ts
│   │   │   ├── anamnesis.ts
│   │   │   └── content.ts
│   │   └── package.json
│   │
│   └── types/                  # TypeScript types compartilhados
│       ├── src/
│       │   ├── api.ts          # Request/Response types
│       │   ├── models.ts       # Domain model types
│       │   └── enums.ts        # Enums compartilhados
│       └── package.json
│
├── infra/
│   ├── docker-compose.yml      # PostgreSQL + Redis para dev local
│   └── scripts/
│       ├── setup-dev.sh        # Setup inicial do ambiente
│       └── reset-db.sh         # Reset do banco de dados
│
├── docs/
│   ├── arquitetura.md
│   ├── api-reference.md
│   ├── deployment.md
│   └── runbook.md
│
├── turbo.json                  # Turborepo pipeline config
├── pnpm-workspace.yaml
├── .env.example                # Todas as variáveis necessárias
├── .gitignore
├── .eslintrc.js
├── .prettierrc
└── package.json
```

---

## Variáveis de Ambiente (.env.example)

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/marcelle_db"

# Redis
REDIS_URL="redis://localhost:6379"

# Auth (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# API
API_URL="http://localhost:3001"
API_SECRET="internal-secret-for-web-to-api"

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME="marcelle-storage"
R2_PUBLIC_URL=""

# Email (Resend)
RESEND_API_KEY=""
EMAIL_FROM="Marcelle Breciani <noreply@marcellebreciani.com.br>"

# Push Notifications (VAPID)
VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""
VAPID_SUBJECT="mailto:marcellebreciani@gmail.com"

# Real-time (Pusher)
PUSHER_APP_ID=""
PUSHER_KEY=""
PUSHER_SECRET=""
PUSHER_CLUSTER="us2"
NEXT_PUBLIC_PUSHER_KEY=""
NEXT_PUBLIC_PUSHER_CLUSTER="us2"

# Monitoring (Sentry)
SENTRY_DSN=""
NEXT_PUBLIC_SENTRY_DSN=""
```

---

## Comandos de Desenvolvimento

```bash
# Setup inicial
pnpm install
pnpm db:generate    # prisma generate
pnpm db:migrate     # prisma migrate dev
pnpm db:seed        # seed inicial (trilhas + templates)

# Desenvolvimento
pnpm dev            # Sobe todos os apps em paralelo

# Testes
pnpm test           # Roda todos os testes
pnpm test:e2e       # Playwright E2E

# Build
pnpm build          # Build todos os apps

# Database
pnpm db:studio      # Prisma Studio (GUI do banco)
pnpm db:reset       # Reset + reseed (apenas dev)
```

---

## Conventions

### Commits (Conventional Commits)
```
feat(tasks): add recurring task support
fix(auth): redirect loop on client login
chore(deps): update prisma to 6.2.0
test(tasks): add integration tests for task creation
```

### Branch Strategy
```
main                # Produção
develop             # Integração
feature/task-name   # Feature branches
fix/bug-description # Hotfixes
```

### API Routes (REST)
```
GET    /clients              # Lista
POST   /clients              # Criar
GET    /clients/:id          # Detalhe
PATCH  /clients/:id          # Atualizar
DELETE /clients/:id          # Deletar (soft)

GET    /clients/:id/tasks    # Tarefas do cliente
POST   /clients/:id/tasks    # Criar tarefa
PATCH  /tasks/:id            # Atualizar tarefa
POST   /tasks/:id/complete   # Concluir tarefa
POST   /tasks/:id/questions  # Abrir dúvida
```
