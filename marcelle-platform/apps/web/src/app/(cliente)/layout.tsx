'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Home, CheckSquare, ClipboardList, BookOpen, User, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NotificationBell } from '@/components/NotificationBell'

const NAV_ITEMS = [
  { href: '/inicio',    label: 'Início',   icon: Home },
  { href: '/tarefas',   label: 'Tarefas',  icon: CheckSquare },
  { href: '/aprender',  label: 'Aprender', icon: BookOpen },
  { href: '/anamnese',  label: 'Anamnese', icon: ClipboardList },
  { href: '/meu-plano', label: 'Plano',    icon: User },
]

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-cream-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal rounded-xl flex items-center justify-center">
            <span className="text-white font-heading font-bold text-xs">MB</span>
          </div>
          <span className="font-heading font-semibold text-teal text-sm">Marcelle Breciani</span>
        </div>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-teal/8 text-teal'
                    : 'text-neutral-500 hover:text-neutral-700 hover:bg-cream'
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <NotificationBell theme="light" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-salmon/20 rounded-full flex items-center justify-center">
              <span className="text-salmon-600 text-xs font-semibold">
                {session?.user?.name?.charAt(0)?.toUpperCase() ?? 'C'}
              </span>
            </div>
            <span className="text-sm text-neutral-600">{session?.user?.name?.split(' ')[0]}</span>
          </div>
          <Link
            href="/configuracoes"
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-cream transition-colors"
            title="Configurações"
          >
            <Settings size={16} />
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-cream transition-colors"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-cream-200 z-10 safe-area-bottom">
        <div className="flex items-stretch">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-all',
                  isActive ? 'text-teal' : 'text-neutral-400'
                )}
              >
                <Icon size={20} className={isActive ? 'stroke-[2.5]' : ''} />
                <span>{item.label}</span>
                {isActive && <div className="absolute bottom-0 w-8 h-0.5 bg-teal rounded-full" />}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
