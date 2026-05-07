'use client'

import { useSession } from 'next-auth/react'
import { ChangePasswordForm } from '@/components/ChangePasswordForm'

export default function ConfiguracoesAdminPage() {
  const { data: session } = useSession()

  return (
    <div className="p-6 lg:p-8 max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-teal">Configurações</h1>
        <p className="text-neutral-500 mt-1 text-sm">Gerencie sua conta</p>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm mb-4">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Minha conta</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-on-surface-variant mb-0.5">Nome</p>
            <p className="text-on-surface">{session?.user?.name}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant mb-0.5">E-mail</p>
            <p className="text-on-surface">{session?.user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant mb-0.5">Papel</p>
            <p className="text-on-surface capitalize">{(session?.user as any)?.role?.toLowerCase().replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      <ChangePasswordForm />
    </div>
  )
}
