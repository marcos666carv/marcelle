'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { CheckSquare, Target, ClipboardList, ArrowRight, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

export default function InicioPage() {
  const { data: session } = useSession()
  const clientId = (session?.user as any)?.clientId

  const { data: tasks } = useQuery({
    queryKey: ['my-tasks-summary'],
    queryFn: () => apiClient.get<any[]>('/tasks'),
  })

  const { data: plan } = useQuery({
    queryKey: ['my-plan', clientId],
    queryFn: () => apiClient.get<any>(`/plans/client/${clientId}`),
    enabled: !!clientId,
    retry: false,
  })

  const { data: anamnesis } = useQuery({
    queryKey: ['my-anamnesis', clientId],
    queryFn: () => apiClient.get<any>(`/clients/${clientId}/anamnesis`),
    enabled: !!clientId,
    retry: false,
  })

  const pendingTasks = tasks?.filter((t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS') ?? []
  const completedTasks = tasks?.filter((t) => t.status === 'COMPLETED') ?? []
  const firstName = session?.user?.name?.split(' ')[0] ?? 'cliente'

  const anamnesisProgress = anamnesis
    ? (() => {
        const totalFields = anamnesis.sections?.reduce((s: number, sec: any) => s + sec.fields.length, 0) ?? 0
        const filledFields = anamnesis.sections?.reduce(
          (s: number, sec: any) => s + sec.fields.filter((f: any) => f.responses?.length > 0).length,
          0
        ) ?? 0
        return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
      })()
    : null

  return (
    <div className="p-5 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-7">
        <h1 className="text-xl font-heading font-bold text-teal">
          Olá, {firstName} 👋
        </h1>
        <p className="text-neutral-500 text-sm mt-1">Bem-vindo à sua área de planejamento financeiro.</p>
      </div>

      <div className="space-y-3">
        {/* Tasks summary */}
        <Link
          href="/tarefas"
          className="block bg-white rounded-2xl border border-cream-200 p-5 shadow-sm hover:border-teal/30 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal/8 flex items-center justify-center">
                <CheckSquare size={18} className="text-teal" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">Tarefas</p>
                {tasks === undefined ? (
                  <Loader2 size={12} className="animate-spin text-neutral-300 mt-1" />
                ) : pendingTasks.length > 0 ? (
                  <p className="text-xs text-neutral-500 mt-0.5">
                    <span className="font-semibold text-teal">{pendingTasks.length}</span> pendente{pendingTasks.length !== 1 ? 's' : ''}
                    {completedTasks.length > 0 && ` · ${completedTasks.length} concluída${completedTasks.length !== 1 ? 's' : ''}`}
                  </p>
                ) : completedTasks.length > 0 ? (
                  <p className="text-xs text-emerald-500 mt-0.5">Todas concluídas 🎉</p>
                ) : (
                  <p className="text-xs text-neutral-400 mt-0.5">Nenhuma tarefa ainda</p>
                )}
              </div>
            </div>
            <ArrowRight size={16} className="text-neutral-300 group-hover:text-teal transition-colors" />
          </div>
        </Link>

        {/* Anamnesis summary — only show if available */}
        {anamnesis !== undefined && anamnesis && (
          <Link
            href="/anamnese"
            className="block bg-white rounded-2xl border border-cream-200 p-5 shadow-sm hover:border-teal/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal/8 flex items-center justify-center">
                  <ClipboardList size={18} className="text-teal" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">Anamnese Financeira</p>
                  {anamnesis.status === 'COMPLETED' ? (
                    <p className="text-xs text-emerald-500 mt-0.5">Concluída</p>
                  ) : (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {anamnesisProgress}% preenchida
                    </p>
                  )}
                </div>
              </div>
              <ArrowRight size={16} className="text-neutral-300 group-hover:text-teal transition-colors" />
            </div>
            <div className="h-1 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all duration-500"
                style={{ width: `${anamnesisProgress}%` }}
              />
            </div>
          </Link>
        )}

        {/* Plan summary */}
        <Link
          href="/meu-plano"
          className="block bg-white rounded-2xl border border-cream-200 p-5 shadow-sm hover:border-teal/30 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-salmon/10 flex items-center justify-center">
                <Target size={18} className="text-salmon-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">Meu Plano</p>
                {plan ? (
                  <p className="text-xs text-neutral-500 mt-0.5">{plan.title}</p>
                ) : (
                  <p className="text-xs text-neutral-400 mt-0.5">Em preparação</p>
                )}
              </div>
            </div>
            <ArrowRight size={16} className="text-neutral-300 group-hover:text-teal transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  )
}
