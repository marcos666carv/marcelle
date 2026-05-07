'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { LoginSchema, type LoginInput } from '@marcelle/validators'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  async function onSubmit(data: LoginInput) {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error('Credenciais inválidas. Verifique seu email e senha.')
      return
    }

    // Redirect based on role — middleware handles this
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-heading font-bold text-xl">MB</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-teal-500">Marcelle Breciani</h1>
          <p className="text-sm text-neutral-500 mt-1">Planejamento Financeiro Humanizado</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-8">
          <h2 className="text-lg font-heading font-semibold text-neutral-800 mb-6">
            Entrar na plataforma
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                className={cn(
                  'w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors outline-none',
                  'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10',
                  errors.email
                    ? 'border-red-300 bg-red-50'
                    : 'border-cream-200 bg-cream-50 hover:border-neutral-300'
                )}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    'w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm transition-colors outline-none',
                    'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10',
                    errors.password
                      ? 'border-red-300 bg-red-50'
                      : 'border-cream-200 bg-cream-50 hover:border-neutral-300'
                  )}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all',
                'bg-teal text-white hover:bg-teal-600 active:bg-teal-700',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2 mt-2'
              )}
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-400 mt-6">
          © {new Date().getFullYear()} Marcelle Breciani · Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}
