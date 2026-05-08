import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import './globals.css'

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'marcelle breciani — planejamento financeiro humanizado',
  description:
    'transforme sua relação com o dinheiro. planejamento financeiro que respeita quem você é, seus valores e seu ritmo de vida.',
  keywords: ['planejamento financeiro', 'finanças pessoais', 'educação financeira', 'Marcelle Breciani'],
  openGraph: {
    title: 'marcelle breciani — planejamento financeiro humanizado',
    description: 'transforme sua relação com o dinheiro com um planejamento que respeita quem você é.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={urbanist.variable}>
      <body>{children}</body>
    </html>
  )
}
