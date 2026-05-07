# Fases de Execução — Marcelle Platform

> Ações claras e critérios de aceitação para cada fase.
> Cada fase tem um responsável técnico (agente senior) definido.

---

## FASE 0 — Fundação
**Duração:** 2 semanas | **Agente:** DevOps + Backend Senior

### Ações
- [ ] Criar repositório GitHub (marcelle-platform)
- [ ] Configurar monorepo: Turborepo + pnpm workspaces
- [ ] Criar `apps/web` (Next.js 15) e `apps/api` (Fastify 5)
- [ ] Criar packages: `database`, `ui`, `email`, `validators`, `types`
- [ ] Configurar ESLint (strict) + Prettier + Husky + lint-staged + commitlint
- [ ] Docker Compose: PostgreSQL 16 + Redis 7 para dev local
- [ ] Script `setup-dev.sh` que configura tudo em um comando
- [ ] Provisionar Supabase (PostgreSQL prod) + Upstash (Redis prod)
- [ ] Configurar Sentry (frontend + backend)
- [ ] GitHub Actions: CI pipeline (lint + typecheck + test em PRs)
- [ ] GitHub Actions: Deploy pipeline (Vercel + Railway)
- [ ] `.env.example` com todas as variáveis documentadas

### Critério de Aceitação
`pnpm install && pnpm dev` sobe todos os apps sem erro. PR abre → CI roda e passa.

---

## FASE 1 — Auth & RBAC
**Duração:** 1 semana | **Agente:** Backend Senior + Frontend Senior

### Ações
**Backend:**
- [ ] Prisma schema: `User`, `Session`, `Collaborator`, `Client` (base)
- [ ] Migration inicial + seed de usuário super_admin
- [ ] Endpoints: `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`
- [ ] Middleware JWT com extração de role e permissões
- [ ] `POST /collaborators` (Super Admin only)
- [ ] `GET/PATCH /collaborators/:id/permissions`

**Frontend:**
- [ ] NextAuth v5 com JWT + credentials provider
- [ ] Middleware `middleware.ts` com proteção por role
- [ ] Página `/login` — form simples, validação Zod, toast de erro
- [ ] Redirect pós-login: Admin → `/dashboard`, Cliente → `/inicio`
- [ ] Layout Admin: sidebar com navegação e user menu
- [ ] Layout Cliente: bottom nav mobile + header desktop
- [ ] Página `/equipe` — lista e criação de colaboradores (Super Admin)
- [ ] Design tokens no `tailwind.config.ts` (cream, teal, salmon)

### Critério de Aceitação
- Super Admin loga → vê sidebar admin
- Cria colaborador → colaborador recebe email e loga
- Colaborador não acessa rotas de super admin
- Cliente loga → vê layout cliente, não acessa rotas admin

---

## FASE 2 — Anamnese & Perfil
**Duração:** 1 semana | **Agente:** Backend Senior + Frontend Senior

### Ações
**Backend:**
- [ ] Schema: `Anamnesis`, `AnamnesisSection`, `AnamnesisField`, `AnamnesisResponse`
- [ ] `POST /clients` — criar cliente (cria User + Client)
- [ ] `GET /clients` — lista com filtros (fase, colaborador, status)
- [ ] `GET /clients/:id` — perfil completo
- [ ] CRUD de anamnese (`/clients/:id/anamnesis`)
- [ ] CRUD de seções e campos (`/anamnesis/:id/sections`)
- [ ] `POST /anamnesis/:id/responses` — salvar respostas do cliente
- [ ] Upload de arquivos para R2 (`/uploads` endpoint)
- [ ] Seed: template de anamnese padrão (5 seções, 25 perguntas)

**Frontend:**
- [ ] Página `/admin/clientes` — tabela com filtros e busca
- [ ] Página `/admin/clientes/novo` — form de criação de cliente
- [ ] Página `/admin/clientes/[id]` — perfil do cliente com tabs
- [ ] Tab Anamnese (admin): builder de seções/perguntas + visualização de respostas
- [ ] Página `/anamnese` (cliente) — form multi-step responsivo
  - Progresso visual por seção
  - Auto-save a cada campo
  - Upload de documentos
  - Submissão com confirmação

### Critério de Aceitação
- Admin cria cliente → sistema envia email com acesso
- Admin configura anamnese → cliente preenche step by step
- Admin vê todas as respostas consolidadas no perfil do cliente
- Upload de documento funciona e fica acessível

---

## FASE 3 — Plano Financeiro
**Duração:** 1 semana | **Agente:** Backend Senior + Frontend Senior

### Ações
**Backend:**
- [ ] Schema: `Plan`, `PlanVersion`, `PlanSection`, `Goal`
- [ ] `POST /clients/:id/plan` — criar plano
- [ ] `GET /plans/:id` — plano com seções e metas
- [ ] `PATCH /plans/:id` — atualizar status
- [ ] `PUT /plans/:id/sections` — salvar seções (upsert em batch)
- [ ] `POST /plans/:id/goals` e CRUD de metas
- [ ] Versionamento automático: toda atualização gera PlanVersion
- [ ] `GET /plans/:id/pdf` — gera e retorna PDF (React-PDF server-side)
- [ ] `PATCH /plans/:id/share` — toggle de compartilhamento com cliente

**Frontend:**
- [ ] Tab Plano (admin): editor de blocos com Tiptap
  - Toolbar com formatação básica
  - Seções arrastáveis (reordenação)
  - Sidebar com metas (CRUD inline)
  - Status do plano e botão de compartilhar
  - Histórico de versões (dropdown)
  - Botão export PDF
- [ ] Fase do lifecycle: selector visual com os 5 estágios
- [ ] Página `/meu-plano` (cliente):
  - Visualização elegante do plano (read-only)
  - Progress ring de metas
  - Download PDF
  - Timestamp da última atualização

### Critério de Aceitação
- Admin cria plano com 3 seções e 2 metas → salva e versiona
- Admin compartilha → cliente acessa em `/meu-plano`
- Export PDF gera documento com branding Marcelle
- Edição gera nova versão acessível pelo histórico

---

## FASE 4 — Tarefas & Interação
**Duração:** 1 semana | **Agente:** Backend Senior + Frontend Senior

### Ações
**Backend:**
- [ ] Schema: `Task`, `TaskResponse`, `TaskQuestion`, `TaskAttachment`
- [ ] `POST /clients/:id/tasks` — criar tarefa
- [ ] `GET /clients/:id/tasks` — lista com filtros (status, tipo, prazo)
- [ ] `GET /tasks/:id` — detalhe com resposta e dúvidas
- [ ] `PATCH /tasks/:id` — editar tarefa
- [ ] `POST /tasks/:id/complete` — cliente conclui tarefa
- [ ] `POST /tasks/:id/response` — cliente salva resposta de texto
- [ ] `POST /tasks/:id/upload` — cliente faz upload
- [ ] `POST /tasks/:id/questions` — cliente abre dúvida
- [ ] `PATCH /task-questions/:id/answer` — admin responde dúvida
- [ ] Worker de tarefas recorrentes (BullMQ — cron job diário)
- [ ] Worker de tarefas vencidas (BullMQ — atualiza status)

**Frontend:**
- [ ] Tab Tarefas (admin): criar/editar tarefa (modal/drawer)
  - Tipo, título, descrição, prazo, prioridade, recorrência
  - Material de apoio (links + upload)
  - Lista de todas as tarefas do cliente com status
  - Visualização de dúvidas abertas + resposta inline
- [ ] Página `/tarefas` (cliente):
  - Tabs: Pendentes / Em Dia / Concluídas / Vencidas
  - Card de tarefa com tipo visual distinto por ícone/cor
  - Ação por tipo: checkbox (CHECK), textarea (REFLEXAO), upload (ENVIO)
  - Botão "Tenho uma dúvida" → modal de dúvida
  - Badge de prazo (urgente em vermelho)
- [ ] Página `/tarefas/[id]` (cliente) — detalhe completo com thread de dúvidas

### Critério de Aceitação
- Admin cria tarefa tipo CHECK → cliente vê, marca como feita
- Admin cria tarefa tipo REFLEXAO → cliente escreve resposta, admin vê
- Cliente abre dúvida → admin recebe notificação in-app → responde → cliente vê resposta
- Tarefa recorrente semanal cria próxima instância automaticamente
- Tarefas vencidas mudam status automaticamente

---

## FASE 5 — Hub de Educação
**Duração:** 1 semana | **Agente:** Backend Senior + Frontend Senior

### Ações
**Backend:**
- [ ] Schema: `Track`, `Content`, `ContentProgress`, `ContentComment`
- [ ] CRUD de trilhas (`/tracks`)
- [ ] CRUD de conteúdo (`/tracks/:id/contents`)
- [ ] `POST /contents/:id/complete` — marcar como concluído
- [ ] `GET /contents/:id/comments` + `POST` — comentários
- [ ] `GET /clients/:id/education-progress` — progresso por trilha
- [ ] Seed completo: 8 trilhas × 5 materiais = 40 registros base
- [ ] Flag `isPublic` para conteúdo de marketing

**Frontend:**
- [ ] Página `/admin/conteudo` — gestão de trilhas e materiais
  - Tabela de trilhas com ordenação
  - Editor de material: tipo, conteúdo rico, metadados
  - Toggle público/privado
- [ ] Página `/aprender` (cliente):
  - Grid de trilhas com progresso (Progress ring)
  - Destaque na trilha mais relevante para a fase do lifecycle
  - Badge "Novo" em materiais recentes
- [ ] Página `/aprender/[trackSlug]` (cliente):
  - Lista de materiais com progresso visual
  - Material bloqueado se anterior não concluído (opcional, config por trilha)
- [ ] Página `/aprender/[trackSlug]/[contentId]` (cliente):
  - Renderização por tipo: artigo, vídeo embed, checklist interativo, PDF, reflexão
  - Botão "Marcar como concluído"
  - Seção de comentários
  - Navegação prev/next

### Critério de Aceitação
- 40 materiais seedados e acessíveis
- Cliente completa material → progresso da trilha atualiza
- Admin cria novo material → aparece na trilha correta
- Checklist interativo salva estado por cliente
- Reflexão salva texto do cliente acessível pelo admin

---

## FASE 6 — Notificações & Push
**Duração:** 1 semana | **Agente:** Backend Senior + Frontend Senior

### Ações
**Backend:**
- [ ] Schema: `Notification`, `PushSubscription`
- [ ] `POST /notifications/subscribe` — salvar subscription de push
- [ ] `DELETE /notifications/subscribe` — revogar subscription
- [ ] `GET /notifications` — lista paginada do usuário
- [ ] `PATCH /notifications/:id/read` e `PATCH /notifications/read-all`
- [ ] `NotificationService` — método único `notify(userId, payload)` que:
  - Salva no banco
  - Dispara push (se subscrito) via fila BullMQ
  - Envia email (se configurado para o tipo)
- [ ] Worker push (BullMQ): processa fila com retry e dead letter
- [ ] Integrar `NotificationService` em todos os eventos relevantes:
  - Task criada → cliente
  - Task vencendo (24h) → cliente (cron job)
  - Dúvida respondida → cliente
  - Plano atualizado → cliente
  - Nova dúvida → admin
  - Task concluída → admin
  - Cliente inativo 7 dias → admin (cron job)

**Frontend:**
- [ ] `public/sw.js` — service worker com push event handler
- [ ] `public/manifest.json` — PWA manifest com ícones Marcelle
- [ ] Hook `usePushSubscription` — opt-in/out com VAPID
- [ ] Modal de opt-in de push no primeiro login do cliente
- [ ] Componente `NotificationBell` (admin e cliente):
  - Badge com contagem de não lidas
  - Dropdown com lista das últimas 10
  - Link "Ver todas"
- [ ] Página `/notificacoes` — histórico completo com paginação
- [ ] Página de configurações de notificação por tipo

### Critério de Aceitação
- Cliente aceita push → com browser fechado, recebe push quando admin cria tarefa
- Notificação in-app aparece em tempo real (< 2s) via Pusher
- Email chega em < 30s para eventos críticos
- Admin recebe notificação quando cliente responde tarefa
- Usuário consegue desativar push sem quebrar nada

---

## FASE 7 — Dashboard & Métricas
**Duração:** 1 semana | **Agente:** Backend Senior + Frontend Senior

### Ações
**Backend:**
- [ ] `GET /admin/dashboard` — agregações principais:
  - Total clientes ativos
  - Tarefas pendentes de resposta
  - Clientes por lifecycle phase
  - Clientes inativos (sem engajamento > 7 dias)
  - Dúvidas abertas
- [ ] `GET /admin/clients/:id/metrics` — métricas de um cliente:
  - % tarefas concluídas (geral e por mês)
  - Progresso por trilha de educação
  - Tempo médio de resposta
  - Timeline de eventos
- [ ] `GET /client/dashboard` — dashboard do cliente:
  - Próximas 3 tarefas
  - Progresso do plano (%)
  - Próximo material na trilha
  - Notificações recentes

**Frontend:**
- [ ] Página `/dashboard` (admin):
  - Cards KPI (total clientes, tarefas pendentes, dúvidas abertas)
  - Tabela de clientes por lifecycle com progresso colorido
  - Lista de clientes inativos com CTA de contato
  - Feed de atividade recente
  - Gráfico de engajamento mensal (Recharts LineChart)
- [ ] Página `/inicio` (cliente):
  - Saudação personalizada ("Bom dia, [nome]")
  - Progress ring do plano geral
  - Cards das próximas tarefas (máx. 3)
  - Card da trilha em andamento com próximo material
  - Atividade recente
- [ ] `GET /admin/clients/:id` — tab de métricas no perfil do cliente:
  - Histórico de engajamento (gráfico mensal)
  - Progresso em cada meta do plano
  - Timeline de evolução (anamnese → plano → tarefas concluídas → marcos)

### Critério de Aceitação
- Admin vê em 1 tela quais clientes estão inativos e quais dúvidas precisam de resposta
- Gráficos carregam em < 1s (dados pré-agregados no backend)
- Dashboard cliente carrega em < 800ms (LCP)
- Métricas de cliente mostram progresso real e histórico

---

## FASE 8 — Polimento & Lançamento
**Duração:** 2 semanas | **Agente:** QA + DevOps + Frontend Senior

### Ações
**Testes:**
- [ ] Playwright E2E: fluxo de login (admin + cliente)
- [ ] Playwright E2E: criar cliente → preencher anamnese → criar plano
- [ ] Playwright E2E: criar tarefa → cliente completa → admin vê
- [ ] Playwright E2E: cliente navega trilha educacional
- [ ] Vitest integration: API de tasks, clients, notifications
- [ ] Cobertura de testes: mínimo 80% nas camadas de serviço

**Performance:**
- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices)
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Imagens otimizadas com next/image
- [ ] Infinite scroll ou paginação cursor-based em todas as listas
- [ ] React Query com stale time adequado (evitar re-fetches desnecessários)

**Acessibilidade:**
- [ ] WCAG 2.1 AA nas telas principais
- [ ] Contraste de cor verificado em todos os tokens
- [ ] Navegação por teclado funcional
- [ ] Labels em todos os inputs
- [ ] Alt text em todas as imagens

**Produção:**
- [ ] Backup automático do banco (Supabase daily)
- [ ] Logs estruturados em Axiom
- [ ] Alertas de erro no Sentry
- [ ] Rate limiting nas rotas críticas (auth, upload)
- [ ] CORS configurado apenas para domínios autorizados
- [ ] Headers de segurança (CSP, HSTS, X-Frame-Options)
- [ ] Documentação de runbook (como fazer deploy, rollback, reset de senha)

**Dados iniciais:**
- [ ] Seed de dados demo (1 cliente fictício com anamnese + plano + tarefas)
- [ ] Conta da Marcelle (super_admin) criada e testada
- [ ] Todas as trilhas e materiais publicados

### Critério de Aceitação
- Marcelle usa o sistema por 1 semana com 1 cliente real sem suporte técnico
- Zero erros críticos no Sentry durante a semana de trial
- Marcelle consegue criar cliente, anamnese, plano e tarefas de forma autônoma

---

## Métricas de Sucesso do Produto (pós-lançamento)

| Métrica | Meta | Prazo |
|---------|------|-------|
| Clientes ativos na plataforma | 10 | Mês 2 |
| Taxa de conclusão de tarefas | > 70% | Mês 2 |
| Engajamento com trilhas | > 50% dos clientes acessam | Mês 3 |
| Opt-in de push notifications | > 80% dos clientes | Mês 1 |
| NPS da plataforma | > 8 | Mês 3 |
| Uptime | > 99.5% | Contínuo |
