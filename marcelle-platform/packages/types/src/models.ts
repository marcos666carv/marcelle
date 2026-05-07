export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CLIENT'

export type Permission =
  | 'MANAGE_CLIENTS'
  | 'MANAGE_TASKS'
  | 'MANAGE_PLANS'
  | 'MANAGE_CONTENT'
  | 'VIEW_ANALYTICS'
  | 'MANAGE_TEAM'

export type LifecyclePhase =
  | 'SILENT_CHAOS'
  | 'INITIAL_CLARITY'
  | 'ACTIVE_CONSTRUCTION'
  | 'EXPANSION_FREEDOM'
  | 'FULLNESS_AMBASSADOR'

export const LIFECYCLE_LABELS: Record<LifecyclePhase, string> = {
  SILENT_CHAOS: 'O Caos Silencioso',
  INITIAL_CLARITY: 'Clareza Inicial',
  ACTIVE_CONSTRUCTION: 'Construção Ativa',
  EXPANSION_FREEDOM: 'Expansão e Liberdade',
  FULLNESS_AMBASSADOR: 'Plenitude e Embaixador',
}

export const PERMISSION_LABELS: Record<Permission, string> = {
  MANAGE_CLIENTS: 'Gerenciar clientes',
  MANAGE_TASKS: 'Gerenciar tarefas',
  MANAGE_PLANS: 'Gerenciar planos',
  MANAGE_CONTENT: 'Gerenciar conteúdo',
  VIEW_ANALYTICS: 'Ver métricas',
  MANAGE_TEAM: 'Gerenciar equipe',
}

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  role: UserRole
  collaboratorId?: string
  clientId?: string
  permissions?: Permission[]
}

export interface TokenPayload {
  sub: string
  email: string
  role: UserRole
  collaboratorId?: string
  clientId?: string
  permissions?: Permission[]
  iat: number
  exp: number
}
