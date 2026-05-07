'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'

interface CreateClientForm {
  name: string
  email: string
  phone: string
  birthDate: string
  occupation: string
}

export default function NovoClientePage() {
  const router = useRouter()
  const [form, setForm] = useState<CreateClientForm>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    occupation: '',
  })
  const [errors, setErrors] = useState<Partial<CreateClientForm>>({})

  const mutation = useMutation({
    mutationFn: (data: Partial<CreateClientForm>) =>
      apiClient.post<any>('/clients', data),
    onSuccess: async (client) => {
      // Auto-create anamnesis
      const clientId = client.client?.id ?? client.id
      if (clientId) {
        try {
          await apiClient.post(`/clients/${clientId}/anamnesis`, {})
        } catch {
          // anamnesis creation is best-effort
        }
      }
      toast.success('Cliente criado com sucesso!')
      router.push('/clientes')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  function validate() {
    const e: Partial<CreateClientForm> = {}
    if (!form.name.trim()) e.name = 'Nome é obrigatório'
    if (!form.email.trim()) e.email = 'Email é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const payload: Partial<CreateClientForm> = {
      name: form.name.trim(),
      email: form.email.trim(),
    }
    if (form.phone) payload.phone = form.phone
    if (form.birthDate) payload.birthDate = form.birthDate
    if (form.occupation) payload.occupation = form.occupation
    mutation.mutate(payload)
  }

  function handleChange(field: keyof CreateClientForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/clientes"
          className="p-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">Novo cliente</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">
            Preencha os dados básicos. Uma anamnese será criada automaticamente.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-6 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5">
            Nome completo <span className="text-error">*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ex: Ana Paula Santos"
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/10 transition-colors"
          />
          {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5">
            Email <span className="text-error">*</span>
          </label>
          <input
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            type="email"
            placeholder="email@exemplo.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/10 transition-colors"
          />
          {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5">Telefone / WhatsApp</label>
          <input
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(11) 99999-9999"
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/10 transition-colors"
          />
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Data de nascimento</label>
            <input
              value={form.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              type="date"
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/10 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Ocupação / Profissão</label>
            <input
              value={form.occupation}
              onChange={(e) => handleChange('occupation', e.target.value)}
              placeholder="Ex: Professora"
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/10 transition-colors"
            />
          </div>
        </div>

        {/* Note about password */}
        <div className="rounded-xl bg-surface-container p-4 text-sm text-on-surface-variant">
          Uma senha temporária será gerada automaticamente. O acesso do cliente será ativado após o primeiro login.
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Link
            href="/clientes"
            className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors text-center"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary text-sm font-medium hover:bg-primary-container disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
          >
            {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
            Criar cliente
          </button>
        </div>
      </form>
    </div>
  )
}
