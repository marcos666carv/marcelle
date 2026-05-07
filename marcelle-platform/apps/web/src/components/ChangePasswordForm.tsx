'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Eye, EyeOff, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'

export function ChangePasswordForm({ variant = 'card' }: { variant?: 'card' | 'inline' }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const mutation = useMutation({
    mutationFn: () =>
      apiClient.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  function handleSubmit() {
    if (form.newPassword !== form.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }
    if (form.newPassword.length < 8) {
      toast.error('A nova senha deve ter pelo menos 8 caracteres')
      return
    }
    mutation.mutate()
  }

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20'

  const content = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-on-surface-variant mb-1.5">Senha atual *</label>
        <div className="relative">
          <input
            type={showCurrent ? 'text' : 'password'}
            value={form.currentPassword}
            onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
            className={inputClass}
            placeholder="Sua senha atual"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs text-on-surface-variant mb-1.5">Nova senha *</label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            value={form.newPassword}
            onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
            className={inputClass}
            placeholder="Mínimo 8 caracteres"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {form.newPassword.length > 0 && form.newPassword.length < 8 && (
          <p className="text-xs text-red-400 mt-1">Mínimo 8 caracteres</p>
        )}
      </div>

      <div>
        <label className="block text-xs text-on-surface-variant mb-1.5">Confirmar nova senha *</label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          className={inputClass}
          placeholder="Repita a nova senha"
        />
        {form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword && (
          <p className="text-xs text-red-400 mt-1">As senhas não coincidem</p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={
          !form.currentPassword || !form.newPassword || !form.confirmPassword || mutation.isPending
        }
        className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
      >
        {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
        Alterar senha
      </button>
    </div>
  )

  if (variant === 'inline') return content

  return (
    <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <KeyRound size={16} className="text-on-surface-variant" />
        <h3 className="text-sm font-semibold text-on-surface">Alterar senha</h3>
      </div>
      {content}
    </div>
  )
}
