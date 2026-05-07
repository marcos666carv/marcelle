// Usado no middleware para verificação edge-safe
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isLoginPage = nextUrl.pathname === '/login'
      const isAdminRoute = nextUrl.pathname.startsWith('/admin') || nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/clientes') || nextUrl.pathname.startsWith('/equipe') || nextUrl.pathname.startsWith('/conteudo')
      const isClientRoute = nextUrl.pathname.startsWith('/inicio') || nextUrl.pathname.startsWith('/meu-plano') || nextUrl.pathname.startsWith('/tarefas') || nextUrl.pathname.startsWith('/aprender') || nextUrl.pathname.startsWith('/anamnese')

      if (isLoginPage) {
        if (isLoggedIn) {
          const role = (auth.user as any)?.role
          return Response.redirect(new URL(role === 'CLIENT' ? '/inicio' : '/dashboard', nextUrl))
        }
        return true
      }

      if (!isLoggedIn && (isAdminRoute || isClientRoute)) {
        return Response.redirect(new URL('/login', nextUrl))
      }

      if (isAdminRoute && isLoggedIn) {
        const role = (auth.user as any)?.role
        if (role === 'CLIENT') {
          return Response.redirect(new URL('/inicio', nextUrl))
        }
      }

      if (isClientRoute && isLoggedIn) {
        const role = (auth.user as any)?.role
        if (role !== 'CLIENT') {
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
      }

      return true
    },
  },
  providers: [],
}
