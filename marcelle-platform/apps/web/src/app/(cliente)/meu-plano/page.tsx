'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Loader2, Target, CircleCheck, Circle, Clock } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

interface Goal {
  id: string
  title: string
  description?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE'
}

const PLAN_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT:     { label: 'Em preparação', color: 'bg-neutral-100 text-neutral-500' },
  ACTIVE:    { label: 'Ativo',         color: 'bg-emerald-50 text-emerald-600' },
  COMPLETED: { label: 'Concluído',     color: 'bg-teal/10 text-teal' },
}

const GOAL_STATUS_CONFIG: Record<Goal['status'], { label: string; icon: React.ElementType; iconColor: string; badgeColor: string }> = {
  PENDING:     { label: 'Pendente',     icon: Circle,      iconColor: 'text-neutral-300', badgeColor: 'bg-neutral-100 text-neutral-500' },
  IN_PROGRESS: { label: 'Em andamento', icon: Clock,       iconColor: 'text-amber-400',   badgeColor: 'bg-amber-50 text-amber-600' },
  DONE:        { label: 'Concluído',    icon: CircleCheck, iconColor: 'text-emerald-400', badgeColor: 'bg-emerald-50 text-emerald-600' },
}

export default function MeuPlanoPage() {
  const { data: session } = useSession()
  const clientId = (session?.user as any)?.clientId

  const { data: plan, isLoading, error } = useQuery({
    queryKey: ['my-plan', clientId],
    queryFn: () => apiClient.get<any>(`/plans/client/${clientId}`),
    enabled: !!clientId,
    retry: false,
  })

  if (isLoading) {
    return (
      <div className="p-5 lg:p-8 max-w-2xl mx-auto flex items-center justify-center py-16">
        <Loader2 size={22} className="animate-spin text-teal/40" />
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="p-5 lg:p-8 max-w-2xl mx-auto">
        <h1 className="text-xl font-heading font-bold text-teal mb-6">Meu Plano</h1>
        <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center shadow-sm">
          <Target size={28} className="mx-auto text-neutral-300 mb-3" />
          <p className="text-neutral-500 font-medium text-sm">Plano ainda não disponível</p>
          <p className="text-neutral-400 text-xs mt-1">
            Sua assessora está preparando o seu plano. Em breve estará disponível aqui.
          </p>
        </div>
      </div>
    )
  }

  const goals: Goal[] = (plan.goals as Goal[]) ?? []
  const doneCount = goals.filter((g) => g.status === 'DONE').length
  const inProgressCount = goals.filter((g) => g.status === 'IN_PROGRESS').length
  const progress = goals.length > 0 ? Math.round((doneCount / goals.length) * 100) : 0
  const statusInfo = PLAN_STATUS_LABELS[plan.status] ?? PLAN_STATUS_LABELS['ACTIVE']

  const inProgress = goals.filter((g) => g.status === 'IN_PROGRESS')
  const pending = goals.filter((g) => g.status === 'PENDING')
  const done = goals.filter((g) => g.status === 'DONE')

  return (
    <div className="p-5 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-heading font-bold text-teal">Meu Plano</h1>
        <p className="text-neutral-500 text-sm mt-1">Seu plano financeiro personalizado</p>
      </div>

      {/* Plan header card */}
      <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-sm mb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-heading font-semibold text-neutral-800">{plan.title}</h2>
            {plan.description && (
              <p className="text-sm text-neutral-500 mt-1">{plan.description}</p>
            )}
          </div>
          <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0', statusInfo.color)}>
            {statusInfo.label}
          </span>
        </div>

        {/* Stats row */}
        {goals.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-cream rounded-xl">
                <p className="text-lg font-bold font-heading text-teal">{progress}%</p>
                <p className="text-xs text-neutral-500 mt-0.5">Concluído</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-xl">
                <p className="text-lg font-bold font-heading text-amber-600">{inProgressCount}</p>
                <p className="text-xs text-neutral-500 mt-0.5">Em andamento</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-xl">
                <p className="text-lg font-bold font-heading text-emerald-600">{doneCount}</p>
                <p className="text-xs text-neutral-500 mt-0.5">Concluídos</p>
              </div>
            </div>

            <div className="h-2 bg-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-neutral-400 mt-1.5">{doneCount} de {goals.length} objetivos concluídos</p>
          </>
        )}
      </div>

      {/* Goals grouped by status */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-8 text-center shadow-sm">
          <p className="text-neutral-400 text-sm">Objetivos serão adicionados em breve.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inProgress.length > 0 && (
            <GoalSection title="Em andamento" goals={inProgress} />
          )}
          {pending.length > 0 && (
            <GoalSection title="Próximos objetivos" goals={pending} />
          )}
          {done.length > 0 && (
            <GoalSection title="Concluídos" goals={done} muted />
          )}
        </div>
      )}
    </div>
  )
}

function GoalSection({ title, goals, muted }: { title: string; goals: Goal[]; muted?: boolean }) {
  return (
    <section className={cn(muted && 'opacity-60')}>
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">{title} · {goals.length}</p>
      <div className="space-y-2">
        {goals.map((goal) => {
          const cfg = GOAL_STATUS_CONFIG[goal.status] ?? GOAL_STATUS_CONFIG['PENDING']
          const Icon = cfg.icon
          return (
            <div
              key={goal.id}
              className="bg-white rounded-2xl border border-cream-200 p-4 flex items-start gap-3 shadow-sm"
            >
              <Icon size={18} className={cn('mt-0.5 flex-shrink-0', cfg.iconColor)} />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-medium text-neutral-800',
                  goal.status === 'DONE' && 'line-through text-neutral-400',
                )}>
                  {goal.title}
                </p>
                {goal.description && (
                  <p className="text-xs text-neutral-400 mt-0.5">{goal.description}</p>
                )}
              </div>
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0', cfg.badgeColor)}>
                {cfg.label}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
