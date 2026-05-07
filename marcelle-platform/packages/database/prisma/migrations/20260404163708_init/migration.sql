-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'CLIENT');

-- CreateEnum
CREATE TYPE "LifecyclePhase" AS ENUM ('SILENT_CHAOS', 'INITIAL_CLARITY', 'ACTIVE_CONSTRUCTION', 'EXPANSION_FREEDOM', 'FULLNESS_AMBASSADOR');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AnamnesisStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('TEXT', 'TEXTAREA', 'NUMBER', 'DATE', 'SELECT', 'MULTISELECT', 'BOOLEAN', 'FILE', 'CURRENCY');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('CHECK', 'ACTION', 'REFLECTION', 'UPLOAD', 'READING');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('ARTICLE', 'VIDEO', 'PDF', 'LINK');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collaboratorId" TEXT,
    "lifecyclePhase" "LifecyclePhase" NOT NULL DEFAULT 'SILENT_CHAOS',
    "phone" TEXT,
    "birthDate" TIMESTAMP(3),
    "occupation" TEXT,
    "onboardingStatus" "OnboardingStatus" NOT NULL DEFAULT 'PENDING',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anamnesis" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Anamnese Financeira',
    "status" "AnamnesisStatus" NOT NULL DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anamnesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnamnesisSection" (
    "id" TEXT NOT NULL,
    "anamnesisId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnamnesisSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnamnesisField" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "type" "FieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnamnesisField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnamnesisResponse" (
    "id" TEXT NOT NULL,
    "anamnesisId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "value" TEXT,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnamnesisResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "collaboratorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "TaskType" NOT NULL DEFAULT 'CHECK',
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringRule" JSONB,
    "supportContent" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "collaboratorId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Plano Financeiro Pessoal',
    "description" TEXT,
    "status" "PlanStatus" NOT NULL DEFAULT 'DRAFT',
    "goals" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "ContentType" NOT NULL DEFAULT 'ARTICLE',
    "url" TEXT,
    "body" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_refreshToken_idx" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_userId_key" ON "Collaborator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE INDEX "Client_collaboratorId_idx" ON "Client"("collaboratorId");

-- CreateIndex
CREATE INDEX "Client_lifecyclePhase_idx" ON "Client"("lifecyclePhase");

-- CreateIndex
CREATE INDEX "Anamnesis_clientId_idx" ON "Anamnesis"("clientId");

-- CreateIndex
CREATE INDEX "Anamnesis_status_idx" ON "Anamnesis"("status");

-- CreateIndex
CREATE INDEX "AnamnesisSection_anamnesisId_idx" ON "AnamnesisSection"("anamnesisId");

-- CreateIndex
CREATE INDEX "AnamnesisField_sectionId_idx" ON "AnamnesisField"("sectionId");

-- CreateIndex
CREATE INDEX "AnamnesisResponse_anamnesisId_idx" ON "AnamnesisResponse"("anamnesisId");

-- CreateIndex
CREATE UNIQUE INDEX "AnamnesisResponse_anamnesisId_fieldId_key" ON "AnamnesisResponse"("anamnesisId", "fieldId");

-- CreateIndex
CREATE INDEX "Task_clientId_idx" ON "Task"("clientId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_clientId_key" ON "Plan"("clientId");

-- CreateIndex
CREATE INDEX "Plan_clientId_idx" ON "Plan"("clientId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "Content_isPublished_idx" ON "Content"("isPublished");

-- CreateIndex
CREATE INDEX "Content_type_idx" ON "Content"("type");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "Collaborator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anamnesis" ADD CONSTRAINT "Anamnesis_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnamnesisSection" ADD CONSTRAINT "AnamnesisSection_anamnesisId_fkey" FOREIGN KEY ("anamnesisId") REFERENCES "Anamnesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnamnesisField" ADD CONSTRAINT "AnamnesisField_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "AnamnesisSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnamnesisResponse" ADD CONSTRAINT "AnamnesisResponse_anamnesisId_fkey" FOREIGN KEY ("anamnesisId") REFERENCES "Anamnesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnamnesisResponse" ADD CONSTRAINT "AnamnesisResponse_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "AnamnesisField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "Collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "Collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
