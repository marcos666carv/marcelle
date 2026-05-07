'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: string
  title: string
  body: string
  readAt: string | null
  createdAt: string
}

const TYPE_ICONS: Record<string, string> = {
  NEW_TASK: '✅',
  ANAMNESIS_COMPLETED: '📋',
  PLAN_UPDATED: '🎯',
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export function NotificationBell({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.get<{ notifications: Notification[]; unreadCount: number }>('/notifications'),
    refetchInterval: 30_000,
  })

  const markOneMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const markAllMutation = useMutation({
    mutationFn: () => apiClient.patch('/notifications/read-all', {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = data?.unreadCount ?? 0
  const notifications = data?.notifications ?? []

  const iconClass = theme === 'dark'
    ? 'text-teal-100 hover:text-white hover:bg-white/10'
    : 'text-neutral-500 hover:text-neutral-700 hover:bg-cream'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn('relative p-2 rounded-xl transition-colors', iconClass)}
        title="Notificações"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-cream-200 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-cream-100">
            <p className="text-sm font-semibold text-neutral-700">Notificações</p>
            {unread > 0 && (
              <button
                onClick={() => markAllMutation.mutate()}
                disabled={markAllMutation.isPending}
                className="flex items-center gap-1 text-xs text-teal hover:underline"
              >
                {markAllMutation.isPending
                  ? <Loader2 size={11} className="animate-spin" />
                  : <CheckCheck size={13} />
                }
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={18} className="animate-spin text-teal/40" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={24} className="mx-auto text-neutral-200 mb-2" />
                <p className="text-neutral-400 text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-cream-100">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      if (!n.readAt) markOneMutation.mutate(n.id)
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-cream/50',
                      !n.readAt && 'bg-teal/4',
                    )}
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">
                      {TYPE_ICONS[n.type] ?? '🔔'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm text-neutral-800', !n.readAt && 'font-semibold')}>
                        {n.title}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{n.body}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      <span className="text-xs text-neutral-400">{timeAgo(n.createdAt)}</span>
                      {!n.readAt && (
                        <span className="w-2 h-2 rounded-full bg-teal" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
