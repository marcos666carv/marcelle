'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import {
  Users,
  CheckSquare,
  ClipboardList,
  Target,
  TrendingUp,
  AlertCircle,
  Loader2,
  UserPlus,
  CircleCheck,
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const LIFECYCLE_LABELS: Record<string, string> = {
  SILENT_CHAOS:        'Caos silencioso',
  INITIAL_CLARITY:     'Clareza inicial',
  ACTIVE_CONSTRUCTION: 'Construção ativa',
  EXPANSION_FREEDOM:   'Expansão e liberdade',
  FULLNESS_AMBASSADOR: 'Plenitude',
}

const LIFECYCLE_COLORS: Record<string, string> = {
  SILENT_CHAOS:        'bg-error-container text-error',
  INITIAL_CLARITY:     'bg-amber-100 text-amber-700',
  ACTIVE_CONSTRUCTION: 'bg-primary-fixed text-primary',
  EXPANSION_FREEDOM:   'bg-teal/15 text-teal',
  FULLNESS_AMBASSADOR: 'bg-secondary-container/40 text-secondary',
}

const LIFECYCLE_BAR_COLORS: Record<string, string> = {
  SILENT_CHAOS:        'bg-error',
  INITIAL_CLARITY:     'bg-amber-400',
  ACTIVE_CONSTRUCTION: 'bg-primary-fixed-dim',
  EXPANSION_FREEDOM:   'bg-teal',
  FULLNESS_AMBASSADOR: 'bg-secondary',
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  iconColor,
  highlight,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  highlight?: boolean
}) {
  return (
    <div className={cn(
      'bg-surface rounded-2xl p-5 border shadow-sm flex items-start gap-4',
      highlight ? 'border-error/30 bg-error-container/20' : 'border-outline-variant',
    )}>
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
        <Icon size={18} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-on-surface-variant mb-0.5">{label}</p>
        <p className="text-2xl font-heading font-bold text-on-surface leading-none">{value}</p>
        {sub && <p className="text-xs text-on-surface-variant mt-1">{sub}</p>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(' ')[0] ?? ''

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.get<any>('/dashboard/stats'),
    refetchInterval: 60_000,
  })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-teal">
          {greeting}{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">Aqui está o resumo da sua operação.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-teal/40" />
        </div>
      ) : !stats ? null : (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Total de clientes"
              value={stats.clients.total}
              sub={stats.clients.newThisMonth > 0 ? `+${stats.clients.newThisMonth} este mês` : 'Nenhum novo este mês'}
              icon={Users}
              iconBg="bg-teal/8"
              iconColor="text-teal"
            />
            <KpiCard
              label="Tarefas pendentes"
              value={stats.tasks.pending}
              sub={`${stats.tasks.completionRate}% de conclusão`}
              icon={CheckSquare}
              iconBg={stats.tasks.overdue > 0 ? 'bg-error-container' : 'bg-surface-container'}
              iconColor={stats.tasks.overdue > 0 ? 'text-error' : 'text-on-surface-variant'}
              highlight={stats.tasks.overdue > 0}
            />
            <KpiCard
              label="Anamneses concluídas"
              value={`${stats.anamneses.completionRate}%`}
              sub={`${stats.anamneses.completed} de ${stats.anamneses.total}`}
              icon={ClipboardList}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
            />
            <KpiCard
              label="Planos ativos"
              value={stats.plans.active}
              sub={stats.plans.draft > 0 ? `${stats.plans.draft} em rascunho` : 'Todos publicados'}
              icon={Target}
              iconBg="bg-primary-fixed/40"
              iconColor="text-teal"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client distribution by lifecycle phase */}
            <div className="lg:col-span-2 bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-on-surface mb-4">Clientes por fase do ciclo</h2>
              {stats.clients.total === 0 ? (
                <p className="text-on-surface-variant text-sm py-6 text-center">Nenhum cliente cadastrado.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(LIFECYCLE_LABELS).map(([key, label]) => {
                    const count: number = stats.clients.byPhase[key] ?? 0
                    const pct = stats.clients.total > 0 ? Math.round((count / stats.clients.total) * 100) : 0
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-on-surface-variant text-xs">{label}</span>
                          <span className="text-on-surface-variant text-xs font-medium">{count} · {pct}%</span>
                        </div>
                        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all duration-500', LIFECYCLE_BAR_COLORS[key])}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Tasks breakdown */}
            <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-on-surface mb-4">Visão de tarefas</h2>
              <div className="space-y-3">
                <TaskStat label="Pendentes" value={stats.tasks.pending} color="text-amber-700" bg="bg-amber-50" />
                <TaskStat label="Concluídas" value={stats.tasks.completed} color="text-teal" bg="bg-teal/8" />
                <TaskStat
                  label="Atrasadas"
                  value={stats.tasks.overdue}
                  color={stats.tasks.overdue > 0 ? 'text-error' : 'text-on-surface-variant'}
                  bg={stats.tasks.overdue > 0 ? 'bg-error-container/40' : 'bg-surface-container'}
                  icon={stats.tasks.overdue > 0 ? AlertCircle : undefined}
                />
              </div>

              {stats.tasks.total > 0 && (
                <div className="mt-5 pt-4 border-t border-outline-variant/50">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1.5">
                    <span>Taxa de conclusão</span>
                    <span className="font-semibold text-teal">{stats.tasks.completionRate}%</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal rounded-full transition-all duration-500"
                      style={{ width: `${stats.tasks.completionRate}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent clients */}
            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-outline-variant/50">
                <UserPlus size={15} className="text-on-surface-variant" />
                <h2 className="text-sm font-semibold text-on-surface">Clientes recentes</h2>
              </div>
              {stats.recentClients.length === 0 ? (
                <p className="px-5 py-8 text-on-surface-variant text-sm text-center">Nenhum cliente ainda.</p>
              ) : (
                <div className="divide-y divide-outline-variant/30">
                  {stats.recentClients.map((client: any) => {
                    const initials = client.user.name
                      .split(' ')
                      .slice(0, 2)
                      .map((w: string) => w[0])
                      .join('')
                      .toUpperCase()
                    return (
                      <div key={client.id} className="flex items-center gap-3 px-5 py-3">
                        <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-teal text-xs font-semibold">{initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-on-surface truncate">{client.user.name}</p>
                          <p className="text-xs text-on-surface-variant truncate">{client.user.email}</p>
                        </div>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0', LIFECYCLE_COLORS[client.lifecyclePhase] ?? 'bg-surface-container text-on-surface-variant')}>
                          {LIFECYCLE_LABELS[client.lifecyclePhase]?.split(' ')[0] ?? client.lifecyclePhase}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Recent completed tasks */}
            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-outline-variant/50">
                <CircleCheck size={15} className="text-on-surface-variant" />
                <h2 className="text-sm font-semibold text-on-surface">Tarefas concluídas recentemente</h2>
              </div>
              {stats.recentCompletedTasks.length === 0 ? (
                <p className="px-5 py-8 text-on-surface-variant text-sm text-center">Nenhuma tarefa concluída ainda.</p>
              ) : (
                <div className="divide-y divide-outline-variant/30">
                  {stats.recentCompletedTasks.map((task: any) => (
                    <div key={task.id} className="flex items-start gap-3 px-5 py-3">
                      <CircleCheck size={16} className="text-teal mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-on-surface truncate">{task.title}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{task.client?.user?.name}</p>
                      </div>
                      {task.completedAt && (
                        <span className="text-xs text-on-surface-variant flex-shrink-0">
                          {new Date(task.completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Anamnesis overview */}
          <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-on-surface-variant" />
              <h2 className="text-sm font-semibold text-on-surface">Progresso das anamneses</h2>
            </div>
            {stats.anamneses.total === 0 ? (
              <p className="text-on-surface-variant text-sm">Nenhuma anamnese criada ainda.</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <AnamnesisStatCard
                  label="Concluídas"
                  value={stats.anamneses.completed}
                  total={stats.anamneses.total}
                  color="bg-teal/10 text-teal"
                  barColor="bg-teal"
                />
                <AnamnesisStatCard
                  label="Em andamento"
                  value={stats.anamneses.inProgress}
                  total={stats.anamneses.total}
                  color="bg-amber-50 text-amber-700"
                  barColor="bg-amber-400"
                />
                <AnamnesisStatCard
                  label="Não iniciadas"
                  value={stats.anamneses.notStarted}
                  total={stats.anamneses.total}
                  color="bg-surface-container text-on-surface-variant"
                  barColor="bg-outline-variant"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function TaskStat({
  label,
  value,
  color,
  bg,
  icon: Icon,
}: {
  label: string
  value: number
  color: string
  bg: string
  icon?: React.ElementType
}) {
  return (
    <div className={cn('flex items-center justify-between px-3.5 py-2.5 rounded-xl', bg)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={13} className={color} />}
        <span className="text-sm text-on-surface">{label}</span>
      </div>
      <span className={cn('text-sm font-semibold', color)}>{value}</span>
    </div>
  )
}

function AnamnesisStatCard({
  label,
  value,
  total,
  color,
  barColor,
}: {
  label: string
  value: number
  total: number
  color: string
  barColor: string
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="text-center">
      <div className={cn('inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold font-heading mb-2', color)}>
        {value}
      </div>
      <p className="text-xs text-on-surface-variant mb-2">{label}</p>
      <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', barColor)} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-on-surface-variant mt-1">{pct}%</p>
    </div>
  )
}
