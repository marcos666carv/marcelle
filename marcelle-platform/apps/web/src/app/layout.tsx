import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'Marcelle Breciani | Planejamento Financeiro',
  description: 'Plataforma de planejamento financeiro humanizado',
  manifest: '/manifest.json',
  themeColor: '#0B3B32',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
