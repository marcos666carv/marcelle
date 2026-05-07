'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, BookOpen, Video, FileText, Link2, ExternalLink, Search } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const CONTENT_TYPES = [
  { value: 'ARTICLE', label: 'Artigos',  icon: FileText, color: 'bg-blue-50 text-blue-600',    border: 'border-blue-100' },
  { value: 'VIDEO',   label: 'Vídeos',   icon: Video,    color: 'bg-red-50 text-red-500',       border: 'border-red-100' },
  { value: 'PDF',     label: 'PDFs',     icon: BookOpen, color: 'bg-amber-50 text-amber-600',   border: 'border-amber-100' },
  { value: 'LINK',    label: 'Links',    icon: Link2,    color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
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
  createdAt: string
}

function ContentCard({ item, onClick }: { item: ContentItem; onClick: () => void }) {
  const cfg = TYPE_MAP[item.type] ?? TYPE_MAP['ARTICLE']
  const Icon = cfg.icon
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all hover:border-teal/20 group',
        cfg.border
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', cfg.color)}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-800 group-hover:text-teal transition-colors line-clamp-2">
            {item.title}
          </p>
          {item.description && (
            <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.description}</p>
          )}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-cream px-2 py-0.5 rounded-md text-neutral-500">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

function ContentDrawer({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  const cfg = TYPE_MAP[item.type] ?? TYPE_MAP['ARTICLE']
  const Icon = cfg.icon

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl max-h-[85vh] lg:rounded-2xl rounded-t-2xl shadow-xl flex flex-col overflow-hidden">
        <div className="flex items-start gap-3 p-5 border-b border-cream-100">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cfg.color)}>
            <Icon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-heading font-semibold text-neutral-800">{item.title}</h2>
            {item.description && <p className="text-sm text-neutral-500 mt-0.5">{item.description}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-600 flex-shrink-0">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {item.type === 'ARTICLE' && item.body ? (
            <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap leading-relaxed">
              {item.body}
            </div>
          ) : item.url ? (
            <div className="text-center py-8">
              <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4', cfg.color)}>
                <Icon size={24} />
              </div>
              <p className="text-neutral-600 text-sm mb-4">
                {item.type === 'VIDEO' && 'Clique para assistir o vídeo'}
                {item.type === 'PDF' && 'Clique para abrir o PDF'}
                {item.type === 'LINK' && 'Clique para acessar o link'}
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-xl text-sm font-medium hover:opacity-90"
              >
                <ExternalLink size={15} />
                Abrir
              </a>
            </div>
          ) : (
            <p className="text-neutral-400 text-sm text-center py-8">Conteúdo indisponível.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AprenderPage() {
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ContentItem | null>(null)

  const { data: items, isLoading } = useQuery({
    queryKey: ['content-client'],
    queryFn: () => apiClient.get<ContentItem[]>('/content'),
  })

  const filtered = (items ?? []).filter((i) => {
    if (filter && i.type !== filter) return false
    if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-heading font-bold text-teal">Aprender</h1>
        <p className="text-neutral-500 text-sm mt-1">Conteúdos selecionados para o seu desenvolvimento financeiro</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conteúdo…"
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-cream-200 bg-white text-sm focus:outline-none focus:border-teal/40"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('')}
            className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
              !filter ? 'bg-teal text-white border-teal' : 'border-cream-200 bg-white text-neutral-500 hover:border-teal/30'
            )}
          >
            Todos
          </button>
          {CONTENT_TYPES.map((t) => (
            <button key={t.value}
              onClick={() => setFilter(filter === t.value ? '' : t.value)}
              className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                filter === t.value ? 'bg-teal text-white border-teal' : 'border-cream-200 bg-white text-neutral-500 hover:border-teal/30'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={22} className="animate-spin text-teal/40" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center shadow-sm">
          <BookOpen size={28} className="mx-auto text-neutral-300 mb-3" />
          <p className="text-neutral-500 text-sm font-medium">
            {search ? 'Nenhum resultado para essa busca.' : 'Nenhum conteúdo disponível ainda.'}
          </p>
          <p className="text-neutral-400 text-xs mt-1">Em breve novos materiais serão adicionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item) => (
            <ContentCard key={item.id} item={item} onClick={() => setSelected(item)} />
          ))}
        </div>
      )}

      {selected && <ContentDrawer item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
