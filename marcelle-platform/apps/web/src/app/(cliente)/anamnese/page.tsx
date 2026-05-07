'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Loader2, ClipboardList, CheckCircle2, ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

// ─── Field renderers ──────────────────────────────────────────────────────────

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: any
  value: string
  onChange: (val: string) => void
}) {
  const baseInput =
    'w-full px-3.5 py-2.5 rounded-xl border border-cream-200 bg-white text-sm text-neutral-800 focus:outline-none focus:border-teal/50 focus:ring-1 focus:ring-teal/20 transition-colors'

  if (field.type === 'TEXTAREA') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Sua resposta…"
        className={cn(baseInput, 'resize-none')}
      />
    )
  }

  if (field.type === 'TEXT') {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Sua resposta…"
        className={baseInput}
      />
    )
  }

  if (field.type === 'NUMBER') {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className={baseInput}
      />
    )
  }

  if (field.type === 'DATE') {
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={baseInput}
      />
    )
  }

  if (field.type === 'CURRENCY') {
    return (
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400">R$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0,00"
          className={cn(baseInput, 'pl-10')}
        />
      </div>
    )
  }

  if (field.type === 'BOOLEAN') {
    return (
      <div className="flex gap-3">
        {['true', 'false'].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              'flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all',
              value === opt
                ? 'border-teal bg-teal/8 text-teal'
                : 'border-cream-200 bg-white text-neutral-500 hover:border-teal/30'
            )}
          >
            {opt === 'true' ? 'Sim' : 'Não'}
          </button>
        ))}
      </div>
    )
  }

  if (field.type === 'SELECT') {
    const options: string[] = field.options ?? []
    return (
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              'w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all',
              value === opt
                ? 'border-teal bg-teal/8 text-teal font-medium'
                : 'border-cream-200 bg-white text-neutral-600 hover:border-teal/30'
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    )
  }

  if (field.type === 'MULTISELECT') {
    const options: string[] = field.options ?? []
    const selected: string[] = value ? value.split('||') : []

    function toggle(opt: string) {
      const next = selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
      onChange(next.join('||'))
    }

    return (
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              'w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all flex items-center gap-3',
              selected.includes(opt)
                ? 'border-teal bg-teal/8 text-teal font-medium'
                : 'border-cream-200 bg-white text-neutral-600 hover:border-teal/30'
            )}
          >
            <span
              className={cn(
                'w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center',
                selected.includes(opt) ? 'border-teal bg-teal' : 'border-neutral-300'
              )}
            >
              {selected.includes(opt) && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            {opt}
          </button>
        ))}
      </div>
    )
  }

  if (field.type === 'FILE') {
    return (
      <div className="px-4 py-3 rounded-xl border border-dashed border-cream-200 bg-cream/50 text-center">
        <p className="text-sm text-neutral-400">Upload de arquivos disponível em breve</p>
      </div>
    )
  }

  return null
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnamnesePage() {
  const { data: session } = useSession()
  const clientId = (session?.user as any)?.clientId
  const queryClient = useQueryClient()

  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [dirty, setDirty] = useState(false)

  const { data: anamnesis, isLoading, error } = useQuery({
    queryKey: ['my-anamnesis', clientId],
    queryFn: () => apiClient.get<any>(`/clients/${clientId}/anamnesis`),
    enabled: !!clientId,
    retry: false,
  })

  // Populate answers from existing responses
  useEffect(() => {
    if (!anamnesis) return
    const initial: Record<string, string> = {}
    for (const section of anamnesis.sections ?? []) {
      for (const field of section.fields ?? []) {
        if (field.responses?.[0]?.value) {
          initial[field.id] = field.responses[0].value
        }
      }
    }
    setAnswers(initial)
  }, [anamnesis])

  const saveMutation = useMutation({
    mutationFn: (responses: { fieldId: string; value: string }[]) =>
      apiClient.post(`/anamnesis/${anamnesis.id}/responses`, { responses }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-anamnesis', clientId] })
      setDirty(false)
      toast.success('Respostas salvas!')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  function handleSave() {
    if (!anamnesis) return
    const section = anamnesis.sections[currentSection]
    const responses = section.fields
      .filter((f: any) => answers[f.id] !== undefined)
      .map((f: any) => ({ fieldId: f.id, value: answers[f.id] }))

    if (responses.length === 0) {
      toast.error('Preencha ao menos uma resposta para salvar.')
      return
    }
    saveMutation.mutate(responses)
  }

  function handleSaveAndNext() {
    if (!anamnesis) return
    const section = anamnesis.sections[currentSection]
    const responses = section.fields
      .filter((f: any) => answers[f.id] !== undefined && answers[f.id] !== '')
      .map((f: any) => ({ fieldId: f.id, value: answers[f.id] }))

    if (responses.length > 0) {
      saveMutation.mutate(responses, {
        onSuccess: () => {
          setDirty(false)
          if (currentSection < anamnesis.sections.length - 1) {
            setCurrentSection((s) => s + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        },
      })
    } else if (currentSection < anamnesis.sections.length - 1) {
      setCurrentSection((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!clientId || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={22} className="animate-spin text-teal/40" />
      </div>
    )
  }

  if (error || !anamnesis) {
    return (
      <div className="p-5 lg:p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center shadow-sm">
          <ClipboardList size={32} className="mx-auto text-neutral-300 mb-3" />
          <p className="text-neutral-700 font-medium">Anamnese não disponível</p>
          <p className="text-neutral-400 text-sm mt-1">
            Sua anamnese ainda está sendo preparada. Em breve ela estará disponível aqui.
          </p>
        </div>
      </div>
    )
  }

  const sections = anamnesis.sections ?? []
  const section = sections[currentSection]
  const isLastSection = currentSection === sections.length - 1

  // Overall progress
  const totalFields = sections.reduce((s: number, sec: any) => s + sec.fields.length, 0)
  const filledFields = Object.keys(answers).filter((k) => answers[k] !== '').length
  const progress = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0

  const isCompleted = anamnesis.status === 'COMPLETED'

  return (
    <div className="p-5 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-heading font-bold text-teal">Anamnese Financeira</h1>
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 size={12} />
              Concluída
            </span>
          )}
        </div>
        <p className="text-neutral-500 text-sm">Nos conte mais sobre você para personalizarmos seu plano.</p>
      </div>

      {/* Overall progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-neutral-500">Progresso geral</span>
          <span className="text-xs font-semibold text-teal">{progress}%</span>
        </div>
        <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {sections.map((sec: any, i: number) => {
          const secFilled = sec.fields.filter((f: any) => answers[f.id] && answers[f.id] !== '').length
          const secComplete = secFilled === sec.fields.length
          return (
            <button
              key={sec.id}
              onClick={() => {
                if (dirty) handleSave()
                setCurrentSection(i)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={cn(
                'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                currentSection === i
                  ? 'bg-teal text-white'
                  : secComplete
                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  : 'bg-white border border-cream-200 text-neutral-500 hover:border-teal/30 hover:text-teal'
              )}
            >
              {secComplete && currentSection !== i && <CheckCircle2 size={11} />}
              <span>{i + 1}. {sec.title.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* Section form */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-cream-100">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-0.5">
            Seção {currentSection + 1} de {sections.length}
          </p>
          <h2 className="text-base font-heading font-semibold text-neutral-800">{section.title}</h2>
          {section.description && (
            <p className="text-sm text-neutral-500 mt-0.5">{section.description}</p>
          )}
        </div>

        <div className="p-6 space-y-6">
          {section.fields.map((field: any) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              <FieldInput
                field={field}
                value={answers[field.id] ?? ''}
                onChange={(val) => {
                  setAnswers((prev) => ({ ...prev, [field.id]: val }))
                  setDirty(true)
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 border-t border-cream-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setCurrentSection((s) => s - 1)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            disabled={currentSection === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-cream-200 text-sm font-medium text-neutral-500 hover:border-teal/30 hover:text-teal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
            Anterior
          </button>

          <div className="flex items-center gap-2">
            {dirty && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-teal/30 text-sm font-medium text-teal hover:bg-teal/5 disabled:opacity-50 transition-all"
              >
                {saveMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Salvar
              </button>
            )}

            {isLastSection ? (
              <button
                type="button"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {saveMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                Finalizar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndNext}
                disabled={saveMutation.isPending}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {saveMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                Salvar e avançar
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
