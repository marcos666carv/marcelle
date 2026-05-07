'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { UserPlus, Loader2, Users, Search, ChevronRight } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const LIFECYCLE_LABELS: Record<string, { label: string; color: string }> = {
  SILENT_CHAOS:        { label: 'Caos silencioso', color: 'bg-neutral-100 text-neutral-600' },
  INITIAL_CLARITY:     { label: 'Clareza inicial', color: 'bg-sky-50 text-sky-600' },
  ACTIVE_CONSTRUCTION: { label: 'Construção ativa', color: 'bg-amber-50 text-amber-600' },
  EXPANSION_FREEDOM:   { label: 'Expansão e liberdade', color: 'bg-emerald-50 text-emerald-600' },
  FULLNESS_AMBASSADOR: { label: 'Plenitude', color: 'bg-teal/8 text-teal' },
}

const ONBOARDING_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:     { label: 'Pendente', color: 'bg-neutral-100 text-neutral-500' },
  IN_PROGRESS: { label: 'Em andamento', color: 'bg-amber-50 text-amber-600' },
  COMPLETED:   { label: 'Concluído', color: 'bg-emerald-50 text-emerald-600' },
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0">
      <span className="text-primary-container text-sm font-semibold">{initials}</span>
    </div>
  )
}

export default function ClientesPage() {
  const [search, setSearch] = useState('')
  const [phase, setPhase] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: ['clients', { search, phase, page }],
    queryFn: () =>
      apiClient.list<{
        data: any[]
        total: number
        page: number
        limit: number
        hasMore: boolean
      }>('/clients', { search: search || undefined, lifecyclePhase: phase || undefined, page, limit }),
    staleTime: 30_000,
  })

  const clients = data?.data ?? []
  const total = data?.total ?? 0

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">Clientes</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">
            {total > 0 ? `${total} cliente${total !== 1 ? 's' : ''}` : 'Gerencie seus clientes'}
          </p>
        </div>
        <Link
          href="/clientes/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary-container transition-colors shadow-sm"
        >
          <UserPlus size={16} />
          Novo cliente
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou email…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/10"
          />
        </form>
        <select
          value={phase}
          onChange={(e) => { setPhase(e.target.value); setPage(1) }}
          className="px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-none focus:border-primary-container cursor-pointer text-on-surface"
        >
          <option value="">Todas as fases</option>
          {Object.entries(LIFECYCLE_LABELS).map(([v, { label }]) => (
            <option key={v} value={v}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-outline" />
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-outline-variant p-12 text-center">
          <Users size={32} className="mx-auto text-outline mb-3" />
          <p className="text-on-surface font-medium">Nenhum cliente encontrado</p>
          <p className="text-on-surface-variant text-sm mt-1">
            {search || phase ? 'Tente ajustar os filtros.' : 'Adicione o primeiro cliente para começar.'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
            {/* Desktop table */}
            <table className="w-full hidden md:table">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="text-left text-xs font-medium text-outline uppercase tracking-wide px-6 py-3">Cliente</th>
                  <th className="text-left text-xs font-medium text-outline uppercase tracking-wide px-6 py-3">Fase</th>
                  <th className="text-left text-xs font-medium text-outline uppercase tracking-wide px-6 py-3">Onboarding</th>
                  <th className="text-left text-xs font-medium text-outline uppercase tracking-wide px-6 py-3">Tarefas</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {clients.map((client: any) => {
                  const phaseInfo = LIFECYCLE_LABELS[client.lifecyclePhase]
                  const onboardingInfo = ONBOARDING_LABELS[client.onboardingStatus]
                  return (
                    <tr key={client.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={client.user.name} />
                          <div>
                            <p className="text-sm font-medium text-on-surface">{client.user.name}</p>
                            <p className="text-xs text-on-surface-variant">{client.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-medium', phaseInfo?.color ?? 'bg-neutral-100 text-neutral-500')}>
                          {phaseInfo?.label ?? client.lifecyclePhase}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-medium', onboardingInfo?.color ?? 'bg-neutral-100 text-neutral-500')}>
                          {onboardingInfo?.label ?? client.onboardingStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-on-surface-variant">{client._count?.tasks ?? 0}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/clientes/${client.id}`}
                          className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary group-hover:text-primary transition-colors"
                        >
                          Ver perfil
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Mobile list */}
            <div className="md:hidden divide-y divide-outline-variant">
              {clients.map((client: any) => {
                const phaseInfo = LIFECYCLE_LABELS[client.lifecyclePhase]
                return (
                  <Link key={client.id} href={`/clientes/${client.id}`} className="flex items-center gap-3 px-4 py-4 hover:bg-surface-container-low transition-colors">
                    <Avatar name={client.user.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">{client.user.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{client.user.email}</p>
                    </div>
                    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap', phaseInfo?.color ?? 'bg-neutral-100 text-neutral-500')}>
                      {phaseInfo?.label ?? client.lifecyclePhase}
                    </span>
                    <ChevronRight size={16} className="text-outline flex-shrink-0" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Pagination */}
          {(page > 1 || data?.hasMore) && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-outline-variant text-sm disabled:opacity-40 hover:bg-surface-container transition-colors"
              >
                Anterior
              </button>
              <span className="text-sm text-on-surface-variant">Página {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data?.hasMore}
                className="px-4 py-2 rounded-xl border border-outline-variant text-sm disabled:opacity-40 hover:bg-surface-container transition-colors"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
