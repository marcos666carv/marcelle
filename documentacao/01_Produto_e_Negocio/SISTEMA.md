# Sistema Marcelle Breciani — Planejamento Financeiro Humanizado

> Plataforma enterprise de gestão de clientes, educação financeira e automação do processo de planejamento financeiro personalizado.

---

## Visão Geral do Produto

**Produto:** Plataforma web (SaaS interno) com webapp progressivo (PWA)
**Cliente primário:** Marcelle Breciani e colaboradores (Admin)
**Usuário final:** Clientes da Marcelle

### Pilares do Sistema

| Pilar | Descrição |
|-------|-----------|
| **Anamnese & Plano** | Cadastro completo do cliente, histórico com dinheiro, plano financeiro personalizado |
| **Tarefas & Acompanhamento** | Tarefas criadas pelo admin, interação do cliente (check, dúvida, comentário) |
| **Educação & Suporte** | Hub de conteúdo com trilhas temáticas e materiais curados |
| **Comunicação** | Push notifications, notificações em app, histórico de interações |

---

## Stack Técnica (Enterprise Senior)

### Frontend (Web + PWA)
- **Framework:** Next.js 15 (App Router, RSC, Server Actions)
- **Linguagem:** TypeScript strict
- **Estilização:** Tailwind CSS + shadcn/ui
- **Estado:** Zustand + React Query (TanStack Query v5)
- **Forms:** React Hook Form + Zod
- **Animações:** Framer Motion
- **Testes:** Vitest + Testing Library + Playwright (E2E)

### Backend (API + BFF)
- **Runtime:** Node.js 22 LTS
- **Framework:** Fastify 5 (TypeScript)
- **ORM:** Prisma 6 (PostgreSQL)
- **Validação:** Zod
- **Auth:** NextAuth v5 (Auth.js) — JWT + Refresh Tokens
- **Filas:** BullMQ (Redis)
- **Real-time:** Pusher (hosted) ou Socket.io
- **Testes:** Vitest + Supertest

### Infra & Serviços
- **Banco:** PostgreSQL 16 (Supabase ou Railway)
- **Cache:** Redis (Upstash)
- **Storage:** Cloudflare R2 (arquivos, PDFs de planos)
- **Email:** Resend (templates React Email)
- **Push Notifications:** Web Push API + VAPID
- **Deploy:** Vercel (frontend) + Railway/Fly.io (backend)
- **CI/CD:** GitHub Actions
- **Monitoramento:** Sentry + Axiom (logs)

### Estrutura de Repositório (Monorepo)
```
marcelle-platform/
├── apps/
│   ├── web/              # Next.js — Admin + Cliente
│   └── api/              # Fastify — REST + WebSocket
├── packages/
│   ├── database/         # Prisma schema + migrations + seed
│   ├── ui/               # Design system (shadcn customizado)
│   ├── email/            # Templates React Email
│   ├── validators/       # Schemas Zod compartilhados
│   └── types/            # Types TypeScript compartilhados
├── infra/                # Scripts IaC, docker-compose
├── docs/                 # Documentação técnica
└── .github/
    └── workflows/        # CI/CD pipelines
```

---

## Estrutura de Papéis (RBAC)

### Super Admin — Marcelle
- Acesso total à plataforma
- CRUD de colaboradores
- CRUD de clientes e planos
- Criação/edição de conteúdo educacional
- Visualização de métricas e dashboard
- Configurações do sistema

### Admin / Colaborador
- Acesso definido por permissões (granular)
- Gerenciar clientes atribuídos
- Criar/editar anamneses, planos e tarefas
- Responder dúvidas de clientes
- Sem acesso a config do sistema ou dados de outros colaboradores

### Cliente
- Acesso apenas ao seu painel
- Visualizar seu plano financeiro
- Executar/check em tarefas
- Enviar dúvidas em tarefas e tópicos
- Acessar hub de educação
- Receber push notifications

---

## Módulos do Sistema

### Módulo 1 — Anamnese & Perfil do Cliente

**O que é:** Processo de onboarding estruturado que captura a história financeira, emocional e de vida do cliente.

**Campos principais:**
- Dados pessoais e contexto de vida
- História com dinheiro (família, criação, crenças)
- Situação atual (renda, dívidas, investimentos, despesas fixas)
- Objetivos de curto, médio e longo prazo (sonhos, planos)
- Gatilhos emocionais com dinheiro
- Contexto familiar e social

**Fluxo:**
1. Admin cria ficha de anamnese para o cliente
2. Sistema gera link de acesso ao cliente (ou admin preenche junto na reunião)
3. Respostas ficam salvas e acessíveis ao admin
4. Admin valida e complementa após reunião diagnóstico
5. Anamnese vira base para criação do Plano

**Formatos de resposta:**
- Texto livre
- Seleção múltipla
- Escala (1-10)
- Upload de documentos (extrato, histórico)

---

### Módulo 2 — Plano Financeiro

**O que é:** Documento vivo criado e gerenciado pelo admin com o planejamento financeiro do cliente.

**Estrutura do Plano:**
- Fase atual (qual nível do lifecycle o cliente está)
- Diagnóstico resumido (baseado na anamnese)
- Metas definidas (com prazo e valor)
- Ações prioritárias (ligadas a tarefas)
- Orçamento e alocação sugerida
- Linha do tempo de evolução
- Notas e observações internas (visíveis só ao admin)

**Funcionalidades:**
- Editor rico (blocos, similar ao Notion)
- Versionamento (histórico de alterações)
- PDF export automático
- Status do plano (rascunho, ativo, em revisão, concluído)
- Compartilhamento com cliente (leitura)

---

### Módulo 3 — Tarefas & Acompanhamento

**O que é:** Sistema de tarefas criadas pelo admin para o cliente executar, com interação bidirecional.

**Tipos de Tarefa:**
| Tipo | Descrição |
|------|-----------|
| `CHECK` | Tarefa simples de confirmação (leu, fez, entendeu) |
| `ACAO` | Ação concreta com prazo (abrir conta, cancelar cartão) |
| `REFLEXAO` | Pergunta reflexiva com resposta em texto |
| `ENVIO` | Cliente deve anexar documento ou comprovante |
| `LEITURA` | Conteúdo educativo para ler/assistir |

**Funcionalidades:**
- Admin cria tarefas com prazo, tipo, descrição e material de apoio
- Cliente recebe notificação (push + in-app)
- Cliente pode: fazer check, responder, comentar, pedir ajuda
- Admin visualiza status de todas as tarefas por cliente
- Tarefas podem ser recorrentes (semanal, mensal)
- Filtros: pendentes, concluídas, vencidas, aguardando resposta
- KPIs de engajamento por cliente

**Dúvidas em Tarefas:**
- Cliente abre uma dúvida em qualquer tarefa
- Admin recebe notificação
- Thread de resposta (máx. 10 mensagens por thread)
- Dúvida marcada como resolvida pelo admin

---

### Módulo 4 — Hub de Educação

**O que é:** Biblioteca de conteúdo organizada em trilhas temáticas. Parte pública (mkt) e parte privada (clientes).

**Tipos de Conteúdo:**
| Tipo | Formato | Uso |
|------|---------|-----|
| `ARTIGO` | Texto rico + imagens | Blog, trilha |
| `VIDEO` | Embed YouTube/Vimeo | Trilha |
| `CHECKLIST` | Lista de verificação | Ação prática |
| `TEMPLATE` | PDF/planilha download | Ferramenta |
| `CASE` | Relato estruturado | Prova social |
| `REFLEXAO` | Pergunta + espaço de escrita | Mindset |

**Trilhas de Conhecimento:**
Cada trilha tem ao menos 5 materiais em sequência progressiva.

| Trilha | Materiais |
|--------|-----------|
| **Aposentadoria** | 1. O perigo do INSS como único plano / 2. Seu futuro self e quanto ele precisa / 3. A regra dos 4% na prática / 4. PGBL vs VGBL — qual faz sentido pra você / 5. Simulador: quanto guardar hoje |
| **Compra de Bem ou Imóvel** | 1. Financiar ou alugar — a conta real / 2. Quanto dinheiro você precisa ter antes de comprar / 3. Documentação e processo de compra / 4. FIIs vs imóvel físico / 5. Meu imóvel é um investimento? |
| **Viagem** | 1. Planejar viagem sem dívida / 2. Conta global — o que vale a pena / 3. Câmbio e conversão na prática / 4. Seguro viagem: quando é obrigatório / 5. Fundo de viagem em 12 meses |
| **Quitação de Dívidas** | 1. Mapeando todas as dívidas / 2. Avalanche vs Bola de Neve / 3. Renegociar com banco: scripts reais / 4. Quando vale pegar empréstimo para quitar / 5. Construindo o escudo anti-dívida |
| **Partilha de Bens em Vida** | 1. O que é doação em vida e por que considerar / 2. Holding familiar: faz sentido pra você? / 3. Testamento vs doação — diferenças práticas / 4. Imposto e custos da partilha / 5. Conversa difícil: como falar de herança com a família |
| **Educação Financeira Base** | 1. Reserva de emergência: quanto, onde e como / 2. Inflação: o imposto invisível / 3. Juros compostos: o aliado e o inimigo / 4. Orçamento que funciona sem planilha / 5. Investimentos para iniciantes |
| **Mindset & Dinheiro** | 1. Herança emocional com dinheiro / 2. O tabu de falar de dinheiro / 3. Você se acha merecedor de riqueza? / 4. Sabotagem financeira: reconheça os padrões / 5. Construindo uma relação saudável com dinheiro |
| **Cases Reais** | 1. De endividado a investidor em 18 meses / 2. Como organizei a herança sem briga familiar / 3. Divórcio com justiça financeira / 4. Triplicando a rentabilidade: o caso real / 5. Primeira viagem internacional sem dívida |

**Funcionalidades:**
- Trilhas com progresso por cliente (% concluído)
- Materiais podem ser atribuídos como tarefa pelo admin
- Comentários por material (cliente pode interagir)
- Admin pode criar novos materiais via editor
- Tags para organização e busca
- Materiais podem ser públicos (marketing) ou privados (clientes)

---

### Módulo 5 — Dashboard & Métricas

**Admin Dashboard:**
- Total de clientes ativos
- Tarefas pendentes de resposta
- Clientes por fase do lifecycle
- Engajamento (% tarefas concluídas por cliente)
- Progresso nas trilhas de educação
- Próximas reuniões agendadas

**Cliente Dashboard:**
- Progresso geral do plano (%)
- Próximas tarefas (prazo)
- Trilha de educação em andamento
- Últimas atualizações do admin
- Metas e status de cada uma

---

### Módulo 6 — Notificações & Push

**Canais de comunicação:**
- Push Notification (PWA — Web Push API)
- In-app notification (badge + lista)
- Email (Resend — eventos críticos)

**Gatilhos de notificação:**
| Evento | Destinatário | Canal |
|--------|-------------|-------|
| Nova tarefa criada | Cliente | Push + In-app |
| Tarefa vencendo em 24h | Cliente | Push + Email |
| Dúvida respondida | Cliente | Push + In-app |
| Plano atualizado | Cliente | In-app + Email |
| Nova dúvida de cliente | Admin | In-app + Email |
| Tarefa concluída pelo cliente | Admin | In-app |
| Cliente sem engajamento (7 dias) | Admin | In-app |

---

## Fases de Desenvolvimento

### Fase 0 — Fundação (Semana 1-2)
**Objetivo:** Infraestrutura pronta, repositório configurado, ambiente de dev funcional.

**Entregas:**
- [ ] Monorepo configurado (Turborepo + pnpm workspaces)
- [ ] Banco PostgreSQL provisionado (Supabase)
- [ ] Redis provisionado (Upstash)
- [ ] Variáveis de ambiente e secrets
- [ ] CI/CD pipeline básico (GitHub Actions)
- [ ] Docker Compose para dev local
- [ ] ESLint + Prettier + Husky + lint-staged
- [ ] Commitlint (conventional commits)
- [ ] Sentry configurado (frontend + backend)

**Critério de conclusão:** `pnpm dev` sobe todos os apps sem erro.

---

### Fase 1 — Auth & Estrutura Base (Semana 2-3)
**Objetivo:** Sistema de autenticação completo com RBAC.

**Entregas:**
- [ ] Schema Prisma: User, Role, Session, Permission
- [ ] NextAuth v5 configurado (email/senha + magic link)
- [ ] Middleware de proteção de rotas por role
- [ ] Login página (Admin e Cliente — fluxos distintos)
- [ ] Gestão de colaboradores (Super Admin)
- [ ] Layout base (Admin e Cliente — navegação separada)
- [ ] Design system tokens (cores Marcelle: cream, teal, salmon)

**Critério de conclusão:** Admin loga, cria colaborador, colaborador loga com permissões corretas. Cliente loga e vê apenas seu painel.

---

### Fase 2 — Anamnese & Perfil do Cliente (Semana 3-4)
**Objetivo:** Fluxo completo de onboarding do cliente.

**Entregas:**
- [ ] Schema: Client, Anamnesis, AnamnesisSection, AnamnesisField, AnamnesisResponse
- [ ] CRUD de clientes (Admin)
- [ ] Builder de anamnese (Admin cria seções e perguntas)
- [ ] Templates de anamnese padrão (pré-carregados)
- [ ] Formulário multi-step para cliente responder
- [ ] Upload de documentos (R2)
- [ ] Visualização consolidada de anamnese (Admin)
- [ ] Status de onboarding (pendente, em andamento, concluído)

**Critério de conclusão:** Admin cria cliente, envia link de anamnese, cliente preenche, admin visualiza completo.

---

### Fase 3 — Plano Financeiro (Semana 4-5)
**Objetivo:** Criação e gestão do plano personalizado.

**Entregas:**
- [ ] Schema: Plan, PlanVersion, Goal, PlanSection
- [ ] Editor de plano (blocos estilo Notion — usando Tiptap ou BlockNote)
- [ ] Versionamento automático
- [ ] Definição de metas (valor, prazo, categoria)
- [ ] Vinculação plano ↔ fase do lifecycle
- [ ] Visualização do cliente (read-only, elegante)
- [ ] Export PDF (Puppeteer ou React-PDF)
- [ ] Status do plano e workflow de revisão

**Critério de conclusão:** Admin cria plano completo com metas. Cliente visualiza plano formatado. Admin exporta PDF.

---

### Fase 4 — Tarefas & Interação (Semana 5-6)
**Objetivo:** Sistema de tarefas bidirecional.

**Entregas:**
- [ ] Schema: Task, TaskComment, TaskQuestion, TaskAttachment
- [ ] CRUD de tarefas (Admin)
- [ ] Tarefas recorrentes
- [ ] Interface cliente: lista de tarefas (pendente/concluída/vencida)
- [ ] Check / resposta de tarefa pelo cliente
- [ ] Sistema de dúvidas (thread por tarefa)
- [ ] Notificações in-app (Badge, lista de notificações)
- [ ] Dashboard admin: view de tarefas por cliente

**Critério de conclusão:** Admin cria tarefa, cliente recebe, executa ou pergunta dúvida, admin responde.

---

### Fase 5 — Hub de Educação (Semana 6-7)
**Objetivo:** Biblioteca de conteúdo com trilhas.

**Entregas:**
- [ ] Schema: Track, Content, ContentProgress, ContentComment
- [ ] CRUD de conteúdo (Admin — editor rico)
- [ ] Organização em trilhas com ordenação
- [ ] Seed inicial (todos os materiais das 8 trilhas)
- [ ] Interface cliente: explorar trilhas, progresso
- [ ] Marcar conteúdo como concluído
- [ ] Comentários por conteúdo
- [ ] Atribuir material como tarefa (Admin)
- [ ] Conteúdo público vs privado

**Critério de conclusão:** 8 trilhas com 5 materiais cada carregadas. Cliente navega, progride, comenta.

---

### Fase 6 — Notificações & Push (Semana 7-8)
**Objetivo:** Sistema de notificações completo com Web Push.

**Entregas:**
- [ ] Tabela Notification + NotificationSubscription
- [ ] Web Push API (VAPID keys, service worker)
- [ ] PWA manifest configurado
- [ ] Opt-in de push no onboarding do cliente
- [ ] Worker de notificações (BullMQ)
- [ ] Todos os gatilhos de notificação implementados
- [ ] Centro de notificações in-app
- [ ] Configurações de preferência de notificação
- [ ] Templates de email (Resend + React Email)

**Critério de conclusão:** Admin cria tarefa → cliente recebe push mesmo com browser fechado.

---

### Fase 7 — Dashboard & Métricas (Semana 8-9)
**Objetivo:** Visibilidade total do negócio para o Admin.

**Entregas:**
- [ ] Dashboard admin com KPIs principais
- [ ] Gráficos de engajamento (Recharts)
- [ ] Lista de clientes por fase do lifecycle
- [ ] Alertas: clientes inativos, tarefas vencidas
- [ ] Dashboard cliente: progresso visual
- [ ] Linha do tempo de evolução do cliente
- [ ] Relatório exportável por cliente (PDF)

**Critério de conclusão:** Admin vê, em uma tela, saúde de todos os clientes e sabe onde intervir.

---

### Fase 8 — Polimento & Lançamento (Semana 9-10)
**Objetivo:** Produto pronto para uso real.

**Entregas:**
- [ ] Testes E2E (Playwright) — fluxos críticos
- [ ] Testes unitários e de integração (cobertura >80%)
- [ ] Otimizações de performance (Core Web Vitals)
- [ ] Acessibilidade (WCAG 2.1 AA)
- [ ] Documentação de usuário (Admin e Cliente)
- [ ] Seed de dados de demonstração
- [ ] Deploy production configurado
- [ ] Backup automático do banco
- [ ] Runbook de operação

**Critério de conclusão:** Marcelle usa o sistema com um cliente real sem assistência técnica.

---

## Schema de Banco de Dados (Resumo)

```
User → Role, Session
Client → User, Collaborator(admin)
Anamnesis → Client, Sections → Fields → Responses
Plan → Client, PlanVersion, Goals, Sections
Task → Client, Admin, TaskType, Comments, Questions
Track → Contents → ContentProgress (Client), Comments
Notification → User, NotificationSubscription
```

---

## Design System — Identidade Visual

| Token | Valor | Uso |
|-------|-------|-----|
| `color-cream` | `#F5F4F0` | Background principal |
| `color-teal` | `#0B3B32` | Header, CTAs primários |
| `color-salmon` | `#FF9EAA` | Destaques, badges, progresso |
| `color-text` | `#1A1A1A` | Texto principal |
| `color-muted` | `#6B7280` | Texto secundário |
| `font-heading` | DM Sans | Títulos |
| `font-body` | Inter | Corpo do texto |

---

## Marcos e Timeline

| Semana | Fase | Entregável Principal |
|--------|------|---------------------|
| 1-2 | Fase 0 | Infra e repositório |
| 2-3 | Fase 1 | Auth + RBAC + Layout |
| 3-4 | Fase 2 | Anamnese completa |
| 4-5 | Fase 3 | Plano financeiro |
| 5-6 | Fase 4 | Tarefas + Interação |
| 6-7 | Fase 5 | Hub Educacional |
| 7-8 | Fase 6 | Push Notifications |
| 8-9 | Fase 7 | Dashboard + Métricas |
| 9-10 | Fase 8 | Polimento + Deploy |

**Total estimado:** 10 semanas até MVP em produção.

---

## Decisões de Arquitetura

| Decisão | Escolha | Justificativa |
|---------|---------|--------------|
| Monorepo | Turborepo + pnpm | Compartilhamento de types e validators, build cache |
| Auth | NextAuth v5 | Integração nativa Next.js, suporte a magic link e OAuth futuro |
| Editor | Tiptap ou BlockNote | Open source, extensível, output JSON/HTML |
| Push | Web Push API nativa | Não depende de SDK terceiro, funciona em todos os browsers modernos |
| PDF | React-PDF | Geração server-side com controle total de layout |
| Real-time | Pusher | Managed, sem infra para manter, generoso no free tier inicial |
| Storage | Cloudflare R2 | S3-compatible, sem egress fees |

---

*Documento vivo — atualizado a cada fase concluída.*
