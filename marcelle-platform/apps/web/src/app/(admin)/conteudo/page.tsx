'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Loader2, BookOpen, Video, FileText, Link2, Trash2, Pencil, Eye, EyeOff, X, Tag,
} from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const CONTENT_TYPES = [
  { value: 'ARTICLE', label: 'Artigo', icon: FileText, color: 'bg-blue-50 text-blue-600' },
  { value: 'VIDEO',   label: 'Vídeo',  icon: Video,    color: 'bg-red-50 text-red-500' },
  { value: 'PDF',     label: 'PDF',    icon: BookOpen, color: 'bg-amber-50 text-amber-600' },
  { value: 'LINK',    label: 'Link',   icon: Link2,    color: 'bg-emerald-50 text-emerald-600' },
]

const TYPE_MAP = Object.fromEntries(CONTENT_TYPES.map((t) => [t.value, t]))

type ContentItem = {
  id: string
  title: string
  description?: string
  type: string
  url?: string
  body?: string
  tags: string[]
  isPublished: boolean
  createdAt: string
  createdBy: { user: { name: string } }
}

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'ARTICLE',
  url: '',
  body: '',
  tags: '',
  isPublished: false,
}

function ContentModal({ item, onClose }: { item?: ContentItem; onClose: () => void }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(
    item
      ? { ...item, tags: item.tags.join(', '), url: item.url ?? '', body: item.body ?? '', description: item.description ?? '' }
      : EMPTY_FORM
  )
  const isEdit = !!item

  const mutation = useMutation({
    mutationFn: (data: typeof form) => {
      const payload = {
        ...data,
        tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
        url: data.url || undefined,
        body: data.body || undefined,
        description: data.description || undefined,
      }
      return isEdit
        ? apiClient.patch<ContentItem>(`/content/${item!.id}`, payload)
        : apiClient.post<ContentItem>('/content', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-admin'] })
      toast.success(isEdit ? 'Conteúdo atualizado!' : 'Conteúdo criado!')
      onClose()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const needsUrl = form.type === 'VIDEO' || form.type === 'PDF' || form.type === 'LINK'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-heading font-semibold text-on-surface">
            {isEdit ? 'Editar conteúdo' : 'Novo conteúdo'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-on-surface-variant mb-2">Tipo</label>
            <div className="grid grid-cols-4 gap-2">
              {CONTENT_TYPES.map((t) => {
                const Icon = t.icon
                return (
                  <button key={t.value} type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                    className={cn(
                      'flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all',
                      form.type === t.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-outline-variant text-on-surface-variant hover:border-primary/30'
                    )}
                  >
                    <Icon size={16} />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs text-on-surface-variant mb-1.5">Título *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary"
              placeholder="Ex: Como montar um orçamento pessoal"
            />
          </div>

          <div>
            <label className="block text-xs text-on-surface-variant mb-1.5">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="Resumo do conteúdo…"
            />
          </div>

          {needsUrl && (
            <div>
              <label className="block text-xs text-on-surface-variant mb-1.5">URL *</label>
              <input
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary"
                placeholder="https://…"
              />
            </div>
          )}

          {form.type === 'ARTICLE' && (
            <div>
              <label className="block text-xs text-on-surface-variant mb-1.5">Conteúdo</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                rows={5}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary resize-none"
                placeholder="Texto do artigo…"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-on-surface-variant mb-1.5">Tags (separadas por vírgula)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary"
              placeholder="Ex: orçamento, dívidas, investimentos"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, isPublished: !f.isPublished }))}
              className={cn(
                'relative w-10 h-[22px] rounded-full transition-colors flex-shrink-0',
                form.isPublished ? 'bg-primary' : 'bg-outline-variant'
              )}
            >
              <span className={cn(
                'absolute top-[3px] w-4 h-4 bg-white rounded-full shadow transition-transform',
                form.isPublished ? 'translate-x-5' : 'translate-x-[3px]'
              )} />
            </button>
            <span className="text-sm text-on-surface-variant">
              {form.isPublished ? 'Publicado (visível para clientes)' : 'Rascunho (apenas admin)'}
            </span>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-outline-variant text-sm text-on-surface-variant hover:bg-surface-container">
              Cancelar
            </button>
            <button
              onClick={() => mutation.mutate(form)}
              disabled={!form.title.trim() || mutation.isPending}
              className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConteudoPage() {
  const queryClient = useQueryClient()
  const [modal, setModal] = useState<{ open: boolean; item?: ContentItem }>({ open: false })
  const [filter, setFilter] = useState('')

  const { data: items, isLoading } = useQuery({
    queryKey: ['content-admin'],
    queryFn: () => apiClient.get<ContentItem[]>('/content'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/content/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-admin'] })
      toast.success('Conteúdo removido')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      apiClient.patch(`/content/${id}`, { isPublished }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content-admin'] }),
    onError: (err: Error) => toast.error(err.message),
  })

  const filtered = items?.filter((i) => !filter || i.type === filter) ?? []
  const published = items?.filter((i) => i.isPublished).length ?? 0
  const drafts = (items?.length ?? 0) - published

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-teal">Conteúdo</h1>
          <p className="text-neutral-500 mt-1 text-sm">
            {items ? `${published} publicados · ${drafts} rascunhos` : 'Materiais educacionais para clientes'}
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:opacity-90"
        >
          <Plus size={16} />
          Novo conteúdo
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['', ...CONTENT_TYPES.map((t) => t.value)].map((v) => (
          <button key={v}
            onClick={() => setFilter(v)}
            className={cn('px-3.5 py-1.5 rounded-xl text-sm font-medium border transition-all',
              filter === v
                ? 'bg-primary text-on-primary border-primary'
                : 'border-outline-variant text-on-surface-variant hover:border-primary/30'
            )}
          >
            {v === '' ? 'Todos' : CONTENT_TYPES.find((t) => t.value === v)?.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={22} className="animate-spin text-outline" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-outline-variant p-12 text-center">
          <BookOpen size={32} className="mx-auto text-outline mb-3" />
          <p className="text-on-surface-variant text-sm">Nenhum conteúdo ainda.</p>
          <button onClick={() => setModal({ open: true })} className="mt-3 text-sm text-primary hover:underline">
            Criar o primeiro conteúdo →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const cfg = TYPE_MAP[item.type] ?? TYPE_MAP['ARTICLE']
            const Icon = cfg.icon
            return (
              <div key={item.id} className="bg-surface rounded-2xl border border-outline-variant p-4 flex items-start gap-4 group">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', cfg.color)}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-on-surface">{item.title}</p>
                    {!item.isPublished && (
                      <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">Rascunho</span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{item.description}</p>
                  )}
                  {item.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <Tag size={11} className="text-on-surface-variant" />
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleMutation.mutate({ id: item.id, isPublished: !item.isPublished })}
                    title={item.isPublished ? 'Despublicar' : 'Publicar'}
                    className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant"
                  >
                    {item.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={() => setModal({ open: true, item })}
                    className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => deleteMutation.mutate(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-300 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal.open && <ContentModal item={modal.item} onClose={() => setModal({ open: false })} />}
    </div>
  )
}
