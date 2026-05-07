'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { UserPlus, Loader2, Users, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateCollaboratorSchema, type CreateCollaboratorInput } from '@marcelle/validators'
import { PERMISSION_LABELS, type Permission } from '@marcelle/types'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const PERMISSIONS = Object.entries(PERMISSION_LABELS) as [Permission, string][]

function CollaboratorModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([
    'MANAGE_CLIENTS',
    'MANAGE_TASKS',
  ])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCollaboratorInput>({
    resolver: zodResolver(CreateCollaboratorSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: CreateCollaboratorInput) =>
      apiClient.post('/collaborators', { ...data, permissions: selectedPermissions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] })
      toast.success('Colaborador criado com sucesso!')
      reset()
      setSelectedPermissions(['MANAGE_CLIENTS', 'MANAGE_TASKS'])
      onClose()
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const togglePermission = (perm: Permission) => {
    setSelectedPermissions(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-heading font-semibold text-teal mb-5">Adicionar colaborador</h2>

        <form onSubmit={handleSubmit((data) => mutation.mutate({ ...data, permissions: selectedPermissions }))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nome</label>
            <input
              {...register('name')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
              placeholder="Nome completo"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
              placeholder="email@exemplo.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Permissões</label>
            <div className="space-y-2">
              {PERMISSIONS.map(([perm, label]) => (
                <label key={perm} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => togglePermission(perm)}
                    className={cn(
                      'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0',
                      selectedPermissions.includes(perm)
                        ? 'bg-teal border-teal'
                        : 'border-cream-200 group-hover:border-teal-300'
                    )}
                  >
                    {selectedPermissions.includes(perm) && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-sm text-neutral-600">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-cream-200 text-sm font-medium text-neutral-600 hover:bg-cream transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-2.5 px-4 rounded-xl bg-teal text-white text-sm font-medium hover:bg-teal-600 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
            >
              {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EquipePage() {
  const { data: session } = useSession()
  const [modalOpen, setModalOpen] = useState(false)
  const isSuperAdmin = (session?.user as any)?.role === 'SUPER_ADMIN'

  const { data: collaborators, isLoading } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => apiClient.get<any[]>('/collaborators'),
  })

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-teal">Equipe</h1>
          <p className="text-neutral-500 mt-1">Gerencie os colaboradores da plataforma</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white rounded-xl text-sm font-medium hover:bg-teal-600 transition-colors shadow-sm"
          >
            <UserPlus size={16} />
            Adicionar
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-teal/40" />
        </div>
      ) : !collaborators?.length ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center">
          <Users size={32} className="mx-auto text-neutral-300 mb-3" />
          <p className="text-neutral-500 font-medium">Nenhum colaborador ainda</p>
          <p className="text-neutral-400 text-sm mt-1">Adicione colaboradores para ajudar no atendimento aos clientes</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wide px-6 py-3">Colaborador</th>
                <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wide px-6 py-3 hidden md:table-cell">Permissões</th>
                <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wide px-6 py-3">Clientes</th>
                <th className="text-left text-xs font-medium text-neutral-400 uppercase tracking-wide px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {collaborators.map((c: any) => (
                <tr key={c.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-teal text-sm font-semibold">
                          {c.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{c.user.name}</p>
                        <p className="text-xs text-neutral-400">{c.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(c.permissions as Permission[]).slice(0, 3).map((perm) => (
                        <span key={perm} className="inline-flex px-2 py-0.5 bg-teal/8 text-teal text-xs rounded-md">
                          {PERMISSION_LABELS[perm]?.split(' ')[1] ?? perm}
                        </span>
                      ))}
                      {c.permissions.length > 3 && (
                        <span className="inline-flex px-2 py-0.5 bg-cream text-neutral-500 text-xs rounded-md">
                          +{c.permissions.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{c._count.clients}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                      c.user.isActive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-neutral-100 text-neutral-500'
                    )}>
                      {c.user.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CollaboratorModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
