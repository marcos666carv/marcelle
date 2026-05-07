# Schema de Banco de Dados — Marcelle Platform

> Prisma Schema completo para PostgreSQL

```prisma
// ============================================================
// AUTH & USERS
// ============================================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  avatarUrl     String?
  role          UserRole  @default(CLIENT)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relações
  client        Client?
  collaborator  Collaborator?
  sessions      Session[]
  notifications Notification[]
  pushSubs      PushSubscription[]

  @@index([email])
  @@index([role])
}

enum UserRole {
  SUPER_ADMIN
  ADMIN
  CLIENT
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
}

// ============================================================
// COLLABORATORS (Admin users)
// ============================================================

model Collaborator {
  id          String   @id @default(cuid())
  userId      String   @unique
  permissions Json     @default("[]") // Array de Permission enum
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  clients     Client[] // Clientes atribuídos a este colaborador
  tasks       Task[]   // Tarefas criadas por este colaborador
  plans       Plan[]   // Planos criados por este colaborador
}

enum Permission {
  MANAGE_CLIENTS
  MANAGE_TASKS
  MANAGE_PLANS
  MANAGE_CONTENT
  VIEW_ANALYTICS
  MANAGE_TEAM
}

// ============================================================
// CLIENTS
// ============================================================

model Client {
  id              String        @id @default(cuid())
  userId          String        @unique
  collaboratorId  String?       // Admin responsável
  lifecyclePhase  LifecyclePhase @default(SILENT_CHAOS)
  phone           String?
  birthDate       DateTime?
  occupation      String?
  monthlyIncome   Decimal?      @db.Decimal(12, 2)
  onboardingStatus OnboardingStatus @default(PENDING)
  internalNotes   String?       @db.Text // Visível apenas ao admin
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  collaborator    Collaborator? @relation(fields: [collaboratorId], references: [id])
  anamnesis       Anamnesis?
  plan            Plan?
  tasks           Task[]
  contentProgress ContentProgress[]

  @@index([collaboratorId])
  @@index([lifecyclePhase])
}

enum LifecyclePhase {
  SILENT_CHAOS        // O Caos Silencioso
  INITIAL_CLARITY     // Clareza Inicial
  ACTIVE_CONSTRUCTION // Construção Ativa
  EXPANSION_FREEDOM   // Expansão e Liberdade
  FULLNESS_AMBASSADOR // Plenitude e Embaixador
}

enum OnboardingStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}

// ============================================================
// ANAMNESIS
// ============================================================

model Anamnesis {
  id          String          @id @default(cuid())
  clientId    String          @unique
  status      AnamnesisStatus @default(DRAFT)
  completedAt DateTime?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  client      Client          @relation(fields: [clientId], references: [id], onDelete: Cascade)
  sections    AnamnesisSection[]
}

enum AnamnesisStatus {
  DRAFT
  SENT_TO_CLIENT
  IN_PROGRESS
  COMPLETED
  VALIDATED // Admin validou após reunião
}

model AnamnesisSection {
  id          String           @id @default(cuid())
  anamnesisId String
  title       String
  description String?
  order       Int
  createdAt   DateTime         @default(now())

  anamnesis   Anamnesis        @relation(fields: [anamnesisId], references: [id], onDelete: Cascade)
  fields      AnamnesisField[]

  @@index([anamnesisId, order])
}

model AnamnesisField {
  id          String          @id @default(cuid())
  sectionId   String
  label       String
  type        FieldType
  required    Boolean         @default(false)
  options     Json?           // Para campos SELECT/MULTISELECT
  order       Int
  createdAt   DateTime        @default(now())

  section     AnamnesisSection @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  response    AnamnesisResponse?

  @@index([sectionId, order])
}

enum FieldType {
  TEXT
  TEXTAREA
  SELECT
  MULTISELECT
  SCALE      // Escala 1-10
  BOOLEAN
  FILE
  DATE
  CURRENCY
}

model AnamnesisResponse {
  id        String         @id @default(cuid())
  fieldId   String         @unique
  value     String?        @db.Text
  fileUrl   String?        // Para campos FILE
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  field     AnamnesisField @relation(fields: [fieldId], references: [id], onDelete: Cascade)
}

// ============================================================
// PLAN
// ============================================================

model Plan {
  id             String     @id @default(cuid())
  clientId       String     @unique
  collaboratorId String
  title          String     @default("Plano Financeiro Pessoal")
  status         PlanStatus @default(DRAFT)
  currentVersion Int        @default(1)
  sharedWithClient Boolean  @default(false)
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  client         Client     @relation(fields: [clientId], references: [id], onDelete: Cascade)
  collaborator   Collaborator @relation(fields: [collaboratorId], references: [id])
  versions       PlanVersion[]
  goals          Goal[]
  sections       PlanSection[]
}

enum PlanStatus {
  DRAFT
  ACTIVE
  IN_REVIEW
  COMPLETED
  ARCHIVED
}

model PlanVersion {
  id        String   @id @default(cuid())
  planId    String
  version   Int
  snapshot  Json     // Snapshot completo do plano nesta versão
  createdAt DateTime @default(now())
  createdBy String   // collaboratorId

  plan      Plan     @relation(fields: [planId], references: [id], onDelete: Cascade)

  @@unique([planId, version])
  @@index([planId])
}

model PlanSection {
  id        String   @id @default(cuid())
  planId    String
  title     String
  content   Json     // Tiptap/BlockNote JSON content
  order     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  plan      Plan     @relation(fields: [planId], references: [id], onDelete: Cascade)

  @@index([planId, order])
}

model Goal {
  id          String       @id @default(cuid())
  planId      String
  title       String
  description String?
  category    GoalCategory
  targetAmount Decimal?    @db.Decimal(12, 2)
  currentAmount Decimal?   @db.Decimal(12, 2)
  targetDate  DateTime?
  status      GoalStatus   @default(ACTIVE)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  plan        Plan         @relation(fields: [planId], references: [id], onDelete: Cascade)

  @@index([planId])
}

enum GoalCategory {
  EMERGENCY_FUND
  DEBT_PAYOFF
  INVESTMENT
  PROPERTY
  TRAVEL
  RETIREMENT
  EDUCATION
  OTHER
}

enum GoalStatus {
  ACTIVE
  ACHIEVED
  PAUSED
  CANCELLED
}

// ============================================================
// TASKS
// ============================================================

model Task {
  id             String       @id @default(cuid())
  clientId       String
  collaboratorId String
  title          String
  description    String?      @db.Text
  type           TaskType
  status         TaskStatus   @default(PENDING)
  priority       TaskPriority @default(MEDIUM)
  dueDate        DateTime?
  completedAt    DateTime?
  isRecurring    Boolean      @default(false)
  recurringRule  Json?        // { frequency: 'WEEKLY'|'MONTHLY', interval: 1 }
  supportContent Json?        // Links, materiais de apoio
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  client         Client       @relation(fields: [clientId], references: [id], onDelete: Cascade)
  collaborator   Collaborator @relation(fields: [collaboratorId], references: [id])
  response       TaskResponse?
  questions      TaskQuestion[]
  attachments    TaskAttachment[]

  @@index([clientId, status])
  @@index([dueDate])
}

enum TaskType {
  CHECK      // Confirmação simples
  ACTION     // Ação concreta com prazo
  REFLECTION // Pergunta reflexiva com resposta em texto
  UPLOAD     // Cliente deve enviar documento
  READING    // Conteúdo para ler/assistir
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  OVERDUE
  CANCELLED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model TaskResponse {
  id          String   @id @default(cuid())
  taskId      String   @unique
  textContent String?  @db.Text
  checkedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  task        Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
}

model TaskQuestion {
  id             String         @id @default(cuid())
  taskId         String
  clientContent  String         @db.Text
  adminResponse  String?        @db.Text
  status         QuestionStatus @default(OPEN)
  respondedAt    DateTime?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  task           Task           @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([taskId])
}

enum QuestionStatus {
  OPEN
  ANSWERED
  CLOSED
}

model TaskAttachment {
  id        String   @id @default(cuid())
  taskId    String
  fileName  String
  fileUrl   String
  fileSize  Int
  mimeType  String
  createdAt DateTime @default(now())

  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([taskId])
}

// ============================================================
// EDUCATION HUB
// ============================================================

model Track {
  id          String    @id @default(cuid())
  title       String
  description String?   @db.Text
  slug        String    @unique
  coverUrl    String?
  isPublic    Boolean   @default(false) // true = marketing, false = clientes
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  contents    Content[]
}

model Content {
  id          String          @id @default(cuid())
  trackId     String
  title       String
  description String?         @db.Text
  type        ContentType
  body        Json?           // Rich text JSON (artigos, reflexões)
  videoUrl    String?         // YouTube/Vimeo embed
  fileUrl     String?         // PDFs, templates
  checklistItems Json?        // Array de strings para checklists
  externalUrl String?
  isPublic    Boolean         @default(false)
  order       Int
  tags        String[]        @default([])
  publishedAt DateTime?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  track       Track           @relation(fields: [trackId], references: [id], onDelete: Cascade)
  progress    ContentProgress[]
  comments    ContentComment[]

  @@index([trackId, order])
  @@index([tags])
}

enum ContentType {
  ARTICLE
  VIDEO
  CHECKLIST
  TEMPLATE
  CASE_STUDY
  REFLECTION
}

model ContentProgress {
  id          String   @id @default(cuid())
  clientId    String
  contentId   String
  completedAt DateTime?
  createdAt   DateTime @default(now())

  client      Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)
  content     Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)

  @@unique([clientId, contentId])
  @@index([clientId])
}

model ContentComment {
  id        String   @id @default(cuid())
  contentId String
  userId    String   // Pode ser cliente ou admin
  body      String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  content   Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)

  @@index([contentId])
}

// ============================================================
// NOTIFICATIONS
// ============================================================

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  body      String
  data      Json?            // Payload adicional (taskId, contentId, etc.)
  readAt    DateTime?
  createdAt DateTime         @default(now())

  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, readAt])
}

enum NotificationType {
  TASK_CREATED
  TASK_DUE_SOON
  TASK_OVERDUE
  QUESTION_ANSWERED
  PLAN_UPDATED
  NEW_QUESTION        // Para admin
  TASK_COMPLETED      // Para admin
  CLIENT_INACTIVE     // Para admin
  NEW_CONTENT
}

model PushSubscription {
  id        String   @id @default(cuid())
  userId    String
  endpoint  String   @unique
  p256dh    String
  auth      String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

---

## Índices Críticos de Performance

```sql
-- Tarefas pendentes por cliente (query mais frequente)
CREATE INDEX idx_tasks_client_status_due ON tasks(client_id, status, due_date);

-- Notificações não lidas
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;

-- Conteúdo por trilha e ordem
CREATE INDEX idx_content_track_order ON content(track_id, order);

-- Progresso de conteúdo por cliente
CREATE INDEX idx_content_progress_client ON content_progress(client_id, completed_at);
```

---

## Dados de Seed (Anamnese Padrão)

### Seções da Anamnese Base
1. **Contexto de Vida** — quem você é, família, contexto atual
2. **História com Dinheiro** — como cresceu, o que aprendeu, gatilhos
3. **Situação Financeira Atual** — renda, despesas, dívidas, investimentos
4. **Objetivos e Sonhos** — curto (1 ano), médio (3 anos), longo prazo (10+ anos)
5. **Relação Emocional** — medos, bloqueios, expectativas
