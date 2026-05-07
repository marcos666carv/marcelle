'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCog,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NotificationBell } from '@/components/NotificationBell'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/conteudo', label: 'Conteúdo', icon: BookOpen },
  { href: '/equipe', label: 'Equipe', icon: UserCog, superAdminOnly: true },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isSuperAdmin = (session?.user as any)?.role === 'SUPER_ADMIN'

  return (
    <aside className="flex flex-col h-full bg-teal text-white w-64">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-teal-600">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <span className="font-heading font-bold text-sm">MB</span>
          </div>
          <div>
            <p className="font-heading font-semibold text-sm leading-tight">Marcelle Breciani</p>
            <p className="text-xs text-teal-200">Admin</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.filter(item => !item.superAdminOnly || isSuperAdmin).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-teal-100 hover:bg-white/8 hover:text-white'
              )}
            >
              <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-teal-600">
        <div className="px-3 py-1 mb-1">
          <NotificationBell theme="dark" />
        </div>
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 bg-salmon/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-salmon text-xs font-semibold">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{session?.user?.name}</p>
            <p className="text-xs text-teal-200 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-teal-100 hover:bg-white/8 hover:text-white transition-all"
        >
          <LogOut size={16} className="opacity-70" />
          Sair
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-cream-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-cream transition-colors"
          >
            <Menu size={20} className="text-teal" />
          </button>
          <span className="font-heading font-semibold text-teal">Marcelle Breciani</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
