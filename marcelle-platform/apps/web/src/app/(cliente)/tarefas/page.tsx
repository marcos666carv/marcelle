'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, CheckSquare, Circle, CircleCheck } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const TASK_TYPE_LABELS: Record<string, string> = {
  CHECK: 'Checklist',
  ACTION: 'Ação',
  REFLECTION: 'Reflexão',
  UPLOAD: 'Upload',
  READING: 'Leitura',
}

export default function TarefasPage() {
  const queryClient = useQueryClient()

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: () => apiClient.get<any[]>('/tasks'),
  })

  const completeMutation = useMutation({
    mutationFn: (taskId: string) => apiClient.patch(`/tasks/${taskId}/complete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] })
      queryClient.invalidateQueries({ queryKey: ['my-tasks-summary'] })
      toast.success('Tarefa concluída! 🎉')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const pending = tasks?.filter((t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS') ?? []
  const completed = tasks?.filter((t) => t.status === 'COMPLETED') ?? []

  return (
    <div className="p-5 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-heading font-bold text-teal">Tarefas</h1>
        <p className="text-neutral-500 text-sm mt-1">Atividades do seu plano financeiro</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={22} className="animate-spin text-teal/40" />
        </div>
      ) : !tasks?.length ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center shadow-sm">
          <CheckSquare size={28} className="mx-auto text-neutral-300 mb-3" />
          <p className="text-neutral-500 font-medium text-sm">Nenhuma tarefa ainda</p>
          <p className="text-neutral-400 text-xs mt-1">Suas tarefas aparecerão aqui quando forem criadas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
                Pendentes · {pending.length}
              </p>
              <div className="space-y-2">
                {pending.map((task) => (
                  <ClientTaskCard
                    key={task.id}
                    task={task}
                    onComplete={() => completeMutation.mutate(task.id)}
                    completing={completeMutation.isPending && completeMutation.variables === task.id}
                  />
                ))}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
                Concluídas · {completed.length}
              </p>
              <div className="space-y-2 opacity-60">
                {completed.map((task) => (
                  <ClientTaskCard key={task.id} task={task} done />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function ClientTaskCard({
  task,
  onComplete,
  completing,
  done,
}: {
  task: any
  onComplete?: () => void
  completing?: boolean
  done?: boolean
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-cream-200 p-4 flex items-start gap-3 shadow-sm',
        !done && onComplete && 'cursor-pointer hover:border-teal/30 transition-colors',
      )}
      onClick={!done && onComplete ? onComplete : undefined}
    >
      <div className="mt-0.5 flex-shrink-0">
        {completing ? (
          <Loader2 size={18} className="animate-spin text-teal/60" />
        ) : done ? (
          <CircleCheck size={18} className="text-emerald-400" />
        ) : (
          <Circle size={18} className="text-neutral-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium text-neutral-800', done && 'line-through text-neutral-400')}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-xs text-neutral-400 bg-cream px-2 py-0.5 rounded-md">
            {TASK_TYPE_LABELS[task.type] ?? task.type}
          </span>
          {task.dueDate && (
            <span className={cn(
              'text-xs',
              !done && new Date(task.dueDate) < new Date()
                ? 'text-red-400 font-medium'
                : 'text-neutral-400'
            )}>
              Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
      </div>
      {!done && (
        <div className="flex-shrink-0">
          <span className="text-xs text-teal font-medium">Marcar</span>
        </div>
      )}
    </div>
  )
}
