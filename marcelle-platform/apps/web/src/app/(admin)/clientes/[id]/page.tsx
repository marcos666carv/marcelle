'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2, User, ClipboardList, CheckSquare, Target, Plus, Trash2, Circle, CircleCheck, CircleMinus, Clock, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const LIFECYCLE_LABELS: Record<string, string> = {
  SILENT_CHAOS:        'Caos silencioso',
  INITIAL_CLARITY:     'Clareza inicial',
  ACTIVE_CONSTRUCTION: 'Construção ativa',
  EXPANSION_FREEDOM:   'Expansão e liberdade',
  FULLNESS_AMBASSADOR: 'Plenitude',
}

const ANAMNESIS_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:     { label: 'Não iniciada', color: 'bg-neutral-100 text-neutral-500' },
  IN_PROGRESS: { label: 'Em andamento', color: 'bg-amber-50 text-amber-600' },
  COMPLETED:   { label: 'Concluída', color: 'bg-emerald-50 text-emerald-600' },
}

type Tab = 'overview' | 'anamnese' | 'tarefas' | 'plano'

// ─── Tarefas Tab ───────────────────────────────────────────────────────────────

const TASK_TYPE_LABELS: Record<string, string> = {
  CHECK: 'Checklist',
  ACTION: 'Ação',
  REFLECTION: 'Reflexão',
  UPLOAD: 'Upload',
  READING: 'Leitura',
}

const TASK_PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  LOW:    { label: 'Baixa',   color: 'text-neutral-400' },
  MEDIUM: { label: 'Média',   color: 'text-amber-500' },
  HIGH:   { label: 'Alta',    color: 'text-orange-500' },
  URGENT: { label: 'Urgente', color: 'text-red-500' },
}

const TASK_STATUS_COLORS: Record<string, string> = {
  PENDING:     'bg-neutral-100 text-neutral-500',
  IN_PROGRESS: 'bg-amber-50 text-amber-600',
  COMPLETED:   'bg-emerald-50 text-emerald-600',
  SKIPPED:     'bg-neutral-100 text-neutral-400',
}

const TASK_STATUS_LABELS: Record<string, string> = {
  PENDING:     'Pendente',
  IN_PROGRESS: 'Em andamento',
  COMPLETED:   'Concluída',
  SKIPPED:     'Pulada',
}

function TaskModal({
  clientId,
  open,
  onClose,
}: {
  clientId: string
  open: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'CHECK',
    priority: 'MEDIUM',
    dueDate: '',
  })

  const mutation = useMutation({
    mutationFn: (data: typeof form) =>
      apiClient.post('/tasks', {
        clientId,
        title: data.title,
        description: data.description || undefined,
        type: data.type,
        priority: data.priority,
        dueDate: data.dueDate || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', clientId] })
      toast.success('Tarefa criada!')
      setForm({ title: '', description: '', type: 'CHECK', priority: 'MEDIUM', dueDate: '' })
      onClose()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-base font-heading font-semibold text-primary mb-5">Nova tarefa</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-on-surface-variant mb-1.5">Título *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder="Ex: Organizar planilha de gastos"
            />
          </div>

          <div>
            <label className="block text-xs text-on-surface-variant mb-1.5">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="Detalhes opcionais…"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-on-surface-variant mb-1.5">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary"
              >
                {Object.entries(TASK_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-on-surface-variant mb-1.5">Prioridade</label>
              <select
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary"
              >
                {Object.entries(TASK_PRIORITY_LABELS).map(([v, { label }]) => (
                  <option key={v} value={v}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-on-surface-variant mb-1.5">Prazo</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => mutation.mutate(form)}
              disabled={!form.title.trim() || mutation.isPending}
              className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
              Criar tarefa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TarefasTab({ clientId }: { clientId: string }) {
  const [modalOpen, setModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', clientId],
    queryFn: () => apiClient.get<any[]>('/tasks', { clientId }),
  })

  const completeMutation = useMutation({
    mutationFn: (taskId: string) => apiClient.patch(`/tasks/${taskId}/complete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', clientId] })
      toast.success('Tarefa concluída')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const skipMutation = useMutation({
    mutationFn: (taskId: string) => apiClient.patch(`/tasks/${taskId}/skip`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', clientId] }),
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => apiClient.delete(`/tasks/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', clientId] })
      toast.success('Tarefa removida')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const pending = tasks?.filter((t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS') ?? []
  const done = tasks?.filter((t) => t.status === 'COMPLETED' || t.status === 'SKIPPED') ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-on-surface-variant">
          {pending.length} pendente{pending.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-on-primary rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          Nova tarefa
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin text-outline" />
        </div>
      ) : !tasks?.length ? (
        <div className="bg-surface rounded-2xl border border-outline-variant p-10 text-center">
          <CheckSquare size={28} className="mx-auto text-outline mb-3" />
          <p className="text-on-surface-variant text-sm">Nenhuma tarefa ainda.</p>
          <p className="text-on-surface-variant text-xs mt-1">Crie tarefas para guiar o cliente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.length > 0 && (
            <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
              <div className="px-5 py-3 border-b border-outline-variant bg-surface-container-low">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Pendentes</p>
              </div>
              <div className="divide-y divide-outline-variant">
                {pending.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onComplete={() => completeMutation.mutate(task.id)}
                    onSkip={() => skipMutation.mutate(task.id)}
                    onDelete={() => deleteMutation.mutate(task.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {done.length > 0 && (
            <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden opacity-70">
              <div className="px-5 py-3 border-b border-outline-variant bg-surface-container-low">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Concluídas / Puladas</p>
              </div>
              <div className="divide-y divide-outline-variant">
                {done.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onDelete={() => deleteMutation.mutate(task.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <TaskModal clientId={clientId} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

function TaskRow({
  task,
  onComplete,
  onSkip,
  onDelete,
}: {
  task: any
  onComplete?: () => void
  onSkip?: () => void
  onDelete?: () => void
}) {
  const priority = TASK_PRIORITY_LABELS[task.priority]
  const isDone = task.status === 'COMPLETED' || task.status === 'SKIPPED'

  return (
    <div className="px-5 py-3.5 flex items-start gap-3 group">
      <div className="mt-0.5 flex-shrink-0">
        {task.status === 'COMPLETED' ? (
          <CircleCheck size={18} className="text-emerald-500" />
        ) : task.status === 'SKIPPED' ? (
          <CircleMinus size={18} className="text-neutral-300" />
        ) : (
          <Circle size={18} className="text-outline" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium text-on-surface', isDone && 'line-through text-on-surface-variant')}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-on-surface-variant">{TASK_TYPE_LABELS[task.type] ?? task.type}</span>
          {priority && (
            <span className={cn('text-xs font-medium', priority.color)}>{priority.label}</span>
          )}
          {task.dueDate && (
            <span className="text-xs text-on-surface-variant">
              Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
      </div>
      {!isDone && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onComplete && (
            <button
              onClick={onComplete}
              title="Concluir"
              className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 transition-colors"
            >
              <CircleCheck size={15} />
            </button>
          )}
          {onSkip && (
            <button
              onClick={onSkip}
              title="Pular"
              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
            >
              <CircleMinus size={15} />
            </button>
          )}
        </div>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          title="Excluir"
          className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}

// ─── Plano Tab ────────────────────────────────────────────────────────────────

interface Goal {
  id: string
  title: string
  description?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE'
}

const GOAL_STATUS_OPTIONS: { value: Goal['status']; label: string; color: string }[] = [
  { value: 'PENDING',     label: 'Pendente',     color: 'bg-neutral-100 text-neutral-500' },
  { value: 'IN_PROGRESS', label: 'Em andamento', color: 'bg-amber-50 text-amber-600' },
  { value: 'DONE',        label: 'Concluído',    color: 'bg-emerald-50 text-emerald-600' },
]

const PLAN_STATUS_OPTIONS = [
  { value: 'DRAFT',     label: 'Rascunho' },
  { value: 'ACTIVE',    label: 'Ativo' },
  { value: 'COMPLETED', label: 'Concluído' },
]

function PlanoTab({ clientId }: { clientId: string }) {
  const queryClient = useQueryClient()

  const { data: plan, isLoading, error } = useQuery({
    queryKey: ['plan', clientId],
    queryFn: () => apiClient.get<any>(`/plans/client/${clientId}`),
    retry: false,
  })

  // ── Create plan state ──
  const [createForm, setCreateForm] = useState({ title: 'Plano Financeiro Pessoal', description: '' })

  const createMutation = useMutation({
    mutationFn: (data: typeof createForm) => apiClient.post<any>('/plans', { clientId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', clientId] })
      toast.success('Plano criado!')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  // ── Edit plan header ──
  const [editingHeader, setEditingHeader] = useState(false)
  const [headerForm, setHeaderForm] = useState({ title: '', description: '', status: '' })

  const updatePlanMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiClient.patch<any>(`/plans/${plan.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', clientId] })
      toast.success('Plano atualizado!')
      setEditingHeader(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  // ── Goal management ──
  const [goals, setGoals] = useState<Goal[]>([])
  const [goalsLoaded, setGoalsLoaded] = useState(false)
  const [addingGoal, setAddingGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({ title: '', description: '' })
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [editGoalForm, setEditGoalForm] = useState({ title: '', description: '' })

  // Sync goals from plan
  if (plan && !goalsLoaded) {
    setGoals((plan.goals as Goal[]) ?? [])
    setGoalsLoaded(true)
  }

  function saveGoals(nextGoals: Goal[]) {
    updatePlanMutation.mutate({ goals: nextGoals }, {
      onSuccess: () => {
        setGoals(nextGoals)
        queryClient.invalidateQueries({ queryKey: ['plan', clientId] })
      },
    })
  }

  function addGoal() {
    if (!newGoal.title.trim()) return
    const goal: Goal = {
      id: crypto.randomUUID(),
      title: newGoal.title.trim(),
      description: newGoal.description.trim() || undefined,
      status: 'PENDING',
    }
    const next = [...goals, goal]
    saveGoals(next)
    setNewGoal({ title: '', description: '' })
    setAddingGoal(false)
  }

  function deleteGoal(id: string) {
    saveGoals(goals.filter((g) => g.id !== id))
  }

  function cycleGoalStatus(id: string) {
    const order: Goal['status'][] = ['PENDING', 'IN_PROGRESS', 'DONE']
    const next = goals.map((g) => {
      if (g.id !== id) return g
      const idx = order.indexOf(g.status)
      return { ...g, status: order[(idx + 1) % order.length] }
    })
    saveGoals(next)
  }

  function saveEditGoal(id: string) {
    if (!editGoalForm.title.trim()) return
    const next = goals.map((g) =>
      g.id === id
        ? { ...g, title: editGoalForm.title.trim(), description: editGoalForm.description.trim() || undefined }
        : g
    )
    saveGoals(next)
    setEditingGoalId(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={20} className="animate-spin text-outline" />
      </div>
    )
  }

  // No plan yet → create form
  if (error || !plan) {
    return (
      <div className="bg-surface rounded-2xl border border-outline-variant p-8 text-center">
        <Target size={32} className="mx-auto text-outline mb-3" />
        <p className="text-on-surface font-medium">Nenhum plano criado</p>
        <p className="text-on-surface-variant text-sm mt-1 mb-5">Crie o plano financeiro para este cliente.</p>

        <div className="text-left max-w-sm mx-auto space-y-3 mb-5">
          <div>
            <label className="block text-xs text-on-surface-variant mb-1.5">Título</label>
            <input
              value={createForm.title}
              onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-on-surface-variant mb-1.5">Descrição (opcional)</label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="Descrição do plano…"
            />
          </div>
        </div>

        <button
          onClick={() => createMutation.mutate(createForm)}
          disabled={!createForm.title.trim() || createMutation.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {createMutation.isPending && <Loader2 size={14} className="animate-spin" />}
          Criar plano
        </button>
      </div>
    )
  }

  const doneCount = goals.filter((g) => g.status === 'DONE').length
  const progress = goals.length > 0 ? Math.round((doneCount / goals.length) * 100) : 0

  const PLAN_STATUS_COLORS: Record<string, string> = {
    DRAFT:     'bg-neutral-100 text-neutral-500',
    ACTIVE:    'bg-emerald-50 text-emerald-600',
    COMPLETED: 'bg-teal/10 text-teal',
  }

  return (
    <div className="space-y-4">
      {/* Plan header */}
      <div className="bg-surface rounded-2xl border border-outline-variant p-5">
        {editingHeader ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-on-surface-variant mb-1.5">Título</label>
              <input
                value={headerForm.title}
                onChange={(e) => setHeaderForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-on-surface-variant mb-1.5">Descrição</label>
              <textarea
                value={headerForm.description}
                onChange={(e) => setHeaderForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary resize-none"
                placeholder="Descrição…"
              />
            </div>
            <div>
              <label className="block text-xs text-on-surface-variant mb-1.5">Status</label>
              <select
                value={headerForm.status}
                onChange={(e) => setHeaderForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary"
              >
                {PLAN_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setEditingHeader(false)}
                className="flex-1 py-2 rounded-xl border border-outline-variant text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => updatePlanMutation.mutate({ title: headerForm.title, description: headerForm.description, status: headerForm.status })}
                disabled={!headerForm.title.trim() || updatePlanMutation.isPending}
                className="flex-1 py-2 rounded-xl bg-primary text-on-primary text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {updatePlanMutation.isPending && <Loader2 size={13} className="animate-spin" />}
                Salvar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-heading font-semibold text-on-surface">{plan.title}</h3>
                <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', PLAN_STATUS_COLORS[plan.status])}>
                  {PLAN_STATUS_OPTIONS.find((o) => o.value === plan.status)?.label ?? plan.status}
                </span>
              </div>
              {plan.description && <p className="text-sm text-on-surface-variant">{plan.description}</p>}
              {goals.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                    <span>Objetivos concluídos</span>
                    <span className="font-medium text-primary">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">{doneCount} de {goals.length}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setHeaderForm({ title: plan.title, description: plan.description ?? '', status: plan.status })
                setEditingHeader(true)
              }}
              className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
              title="Editar plano"
            >
              <Pencil size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Goals */}
      <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant bg-surface-container-low">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
            Objetivos · {goals.length}
          </p>
          <button
            onClick={() => setAddingGoal(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <Plus size={13} />
            Adicionar
          </button>
        </div>

        {/* Add goal form */}
        {addingGoal && (
          <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low/50">
            <div className="space-y-2.5">
              <input
                autoFocus
                value={newGoal.title}
                onChange={(e) => setNewGoal((f) => ({ ...f, title: e.target.value }))}
                placeholder="Título do objetivo *"
                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary"
                onKeyDown={(e) => { if (e.key === 'Enter') addGoal() }}
              />
              <input
                value={newGoal.description}
                onChange={(e) => setNewGoal((f) => ({ ...f, description: e.target.value }))}
                placeholder="Descrição (opcional)"
                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setAddingGoal(false); setNewGoal({ title: '', description: '' }) }}
                  className="flex-1 py-2 rounded-xl border border-outline-variant text-xs text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  onClick={addGoal}
                  disabled={!newGoal.title.trim() || updatePlanMutation.isPending}
                  className="flex-1 py-2 rounded-xl bg-primary text-on-primary text-xs font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  {updatePlanMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}

        {goals.length === 0 && !addingGoal ? (
          <div className="px-5 py-10 text-center">
            <Target size={24} className="mx-auto text-outline mb-2" />
            <p className="text-on-surface-variant text-sm">Nenhum objetivo ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {goals.map((goal) => {
              const statusOpt = GOAL_STATUS_OPTIONS.find((o) => o.value === goal.status) ?? GOAL_STATUS_OPTIONS[0]
              const isEditing = editingGoalId === goal.id
              return (
                <div key={goal.id} className="px-5 py-3.5 group">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        autoFocus
                        value={editGoalForm.title}
                        onChange={(e) => setEditGoalForm((f) => ({ ...f, title: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary"
                        onKeyDown={(e) => { if (e.key === 'Enter') saveEditGoal(goal.id) }}
                      />
                      <input
                        value={editGoalForm.description}
                        onChange={(e) => setEditGoalForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Descrição (opcional)"
                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setEditingGoalId(null)} className="text-xs text-on-surface-variant hover:underline">Cancelar</button>
                        <button
                          onClick={() => saveEditGoal(goal.id)}
                          disabled={!editGoalForm.title.trim() || updatePlanMutation.isPending}
                          className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                        >
                          {updatePlanMutation.isPending && <Loader2 size={11} className="animate-spin" />}
                          Salvar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      {/* Status cycle button */}
                      <button
                        onClick={() => cycleGoalStatus(goal.id)}
                        title="Clique para alterar status"
                        className="mt-0.5 flex-shrink-0"
                      >
                        {goal.status === 'DONE' ? (
                          <CircleCheck size={18} className="text-emerald-500" />
                        ) : goal.status === 'IN_PROGRESS' ? (
                          <Clock size={18} className="text-amber-400" />
                        ) : (
                          <Circle size={18} className="text-outline" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-medium text-on-surface', goal.status === 'DONE' && 'line-through text-on-surface-variant')}>
                          {goal.title}
                        </p>
                        {goal.description && (
                          <p className="text-xs text-on-surface-variant mt-0.5">{goal.description}</p>
                        )}
                        <span className={cn('inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium', statusOpt.color)}>
                          {statusOpt.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingGoalId(goal.id)
                            setEditGoalForm({ title: goal.title, description: goal.description ?? '' })
                          }}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
                          title="Editar"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-300 hover:text-red-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ client, onUpdate }: { client: any; onUpdate: () => void }) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(client.internalNotes ?? '')
  const [phase, setPhase] = useState(client.lifecyclePhase)

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiClient.patch(`/clients/${client.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', client.id] })
      setEditing(false)
      toast.success('Perfil atualizado')
      onUpdate()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  function handleSave() {
    mutation.mutate({ internalNotes: notes, lifecyclePhase: phase })
  }

  return (
    <div className="space-y-5">
      {/* Info card */}
      <div className="bg-surface rounded-2xl border border-outline-variant p-5">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Informações</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-on-surface-variant text-xs mb-0.5">Email</p>
            <p className="text-on-surface">{client.user.email}</p>
          </div>
          {client.phone && (
            <div>
              <p className="text-on-surface-variant text-xs mb-0.5">Telefone</p>
              <p className="text-on-surface">{client.phone}</p>
            </div>
          )}
          <div>
            <p className="text-on-surface-variant text-xs mb-0.5">Cadastro</p>
            <p className="text-on-surface">
              {new Date(client.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          {client.collaborator && (
            <div>
              <p className="text-on-surface-variant text-xs mb-0.5">Responsável</p>
              <p className="text-on-surface">{client.collaborator.user.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Phase + notes */}
      <div className="bg-surface rounded-2xl border border-outline-variant p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-on-surface">Fase e anotações</h3>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-primary hover:underline"
            >
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="text-xs text-on-surface-variant hover:underline">Cancelar</button>
              <button
                onClick={handleSave}
                disabled={mutation.isPending}
                className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
              >
                {mutation.isPending && <Loader2 size={10} className="animate-spin" />}
                Salvar
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-on-surface-variant mb-1.5">Fase do ciclo</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary-container"
              >
                {Object.entries(LIFECYCLE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-on-surface-variant mb-1.5">Anotações internas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Anotações visíveis apenas para a equipe…"
                className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary-container resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-on-surface-variant text-xs mb-1">Fase</p>
              <p className="text-on-surface">{LIFECYCLE_LABELS[client.lifecyclePhase] ?? client.lifecyclePhase}</p>
            </div>
            {client.internalNotes ? (
              <div>
                <p className="text-on-surface-variant text-xs mb-1">Anotações</p>
                <p className="text-on-surface whitespace-pre-wrap">{client.internalNotes}</p>
              </div>
            ) : (
              <p className="text-on-surface-variant italic">Nenhuma anotação.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Anamnese Tab ──────────────────────────────────────────────────────────────

function AnamneseTab({ clientId }: { clientId: string }) {
  const { data: client } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => apiClient.get<any>(`/clients/${clientId}`),
  })

  const { data: anamnesis, isLoading, error } = useQuery({
    queryKey: ['anamnesis', clientId],
    queryFn: () => apiClient.get<any>(`/clients/${clientId}/anamnesis`),
    retry: false,
  })

  const queryClient = useQueryClient()
  const createMutation = useMutation({
    mutationFn: () => apiClient.post<any>(`/clients/${clientId}/anamnesis`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anamnesis', clientId] })
      toast.success('Anamnese criada')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-outline" />
      </div>
    )
  }

  if (error || !anamnesis) {
    return (
      <div className="bg-surface rounded-2xl border border-outline-variant p-8 text-center">
        <ClipboardList size={32} className="mx-auto text-outline mb-3" />
        <p className="text-on-surface font-medium">Anamnese não encontrada</p>
        <p className="text-on-surface-variant text-sm mt-1 mb-4">
          Crie a anamnese para iniciar o processo de conhecimento do cliente.
        </p>
        <button
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary-container transition-colors"
        >
          {createMutation.isPending && <Loader2 size={14} className="animate-spin" />}
          Criar anamnese
        </button>
      </div>
    )
  }

  const statusInfo = ANAMNESIS_STATUS_LABELS[anamnesis.status] ?? ANAMNESIS_STATUS_LABELS['PENDING']
  const totalFields = anamnesis.sections?.reduce((s: number, sec: any) => s + sec.fields.length, 0) ?? 0
  const filledFields = anamnesis.sections?.reduce(
    (s: number, sec: any) => s + sec.fields.filter((f: any) => f.responses.length > 0).length,
    0
  ) ?? 0
  const progress = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="bg-surface rounded-2xl border border-outline-variant p-5 flex items-center justify-between gap-4">
        <div>
          <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-medium', statusInfo.color)}>
            {statusInfo.label}
          </span>
          {anamnesis.completedAt && (
            <p className="text-xs text-on-surface-variant mt-1">
              Concluída em {new Date(anamnesis.completedAt).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary font-heading">{progress}%</p>
          <p className="text-xs text-on-surface-variant">{filledFields}/{totalFields} respostas</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Sections */}
      {anamnesis.sections?.map((section: any) => {
        const sectionFilled = section.fields.filter((f: any) => f.responses.length > 0).length
        return (
          <div key={section.id} className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant bg-surface-container-low">
              <div>
                <h4 className="text-sm font-semibold text-on-surface">{section.title}</h4>
                {section.description && (
                  <p className="text-xs text-on-surface-variant mt-0.5">{section.description}</p>
                )}
              </div>
              <span className="text-xs text-on-surface-variant">{sectionFilled}/{section.fields.length}</span>
            </div>
            <div className="divide-y divide-outline-variant">
              {section.fields.map((field: any) => {
                const response = field.responses[0]
                return (
                  <div key={field.id} className="px-5 py-3 flex items-start gap-3">
                    <div className={cn(
                      'w-4 h-4 rounded-full mt-0.5 flex-shrink-0',
                      response?.value ? 'bg-primary' : 'bg-outline-variant'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-on-surface">
                        {field.label}
                        {field.required && <span className="text-error ml-1">*</span>}
                      </p>
                      {response?.value && (
                        <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{response.value}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Profile Page ──────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Visão geral', icon: User },
  { id: 'anamnese', label: 'Anamnese', icon: ClipboardList },
  { id: 'tarefas', label: 'Tarefas', icon: CheckSquare },
  { id: 'plano', label: 'Plano', icon: Target },
]

export default function ClienteProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [tab, setTab] = useState<Tab>('overview')
  const queryClient = useQueryClient()

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => apiClient.get<any>(`/clients/${id}`),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader2 size={24} className="animate-spin text-outline" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-8 text-center">
        <p className="text-on-surface-variant">Cliente não encontrado.</p>
        <Link href="/clientes" className="text-primary text-sm mt-2 inline-block hover:underline">← Voltar</Link>
      </div>
    )
  }

  const initials = client.user.name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="p-6 lg:p-8">
      {/* Back */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/clientes" className="p-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-sm text-on-surface-variant">Clientes</span>
        <span className="text-on-surface-variant">/</span>
        <span className="text-sm text-on-surface">{client.user.name}</span>
      </div>

      {/* Profile header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0">
          <span className="text-primary-container text-xl font-bold font-heading">{initials}</span>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-heading font-bold text-primary leading-tight">{client.user.name}</h1>
          <p className="text-on-surface-variant text-sm">{client.user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-outline-variant mb-6">
        {TABS.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === tabId
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <OverviewTab
          client={client}
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ['client', id] })}
        />
      )}
      {tab === 'anamnese' && <AnamneseTab clientId={client.id} />}
      {tab === 'tarefas' && <TarefasTab clientId={client.id} />}
      {tab === 'plano' && <PlanoTab clientId={client.id} />}
    </div>
  )
}
