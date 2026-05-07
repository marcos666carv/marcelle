import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { AuthUser } from '@marcelle/types'

const API_URL = process.env['API_URL'] ?? 'http://localhost:3001'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) return null

          const { data } = (await res.json()) as {
            data: { accessToken: string; refreshToken: string; user: AuthUser }
          }

          return {
            id: data.user.id,
            email: data.user.email ?? '',
            name: data.user.name,
            image: data.user.avatarUrl ?? null,
            role: data.user.role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            collaboratorId: data.user.collaboratorId,
            clientId: data.user.clientId,
            permissions: data.user.permissions ?? [],
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.collaboratorId = user.collaboratorId
        token.clientId = user.clientId
        token.permissions = user.permissions
      }
      return token
    },
    session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = token as any
      session.user.role = t.role
      session.user.accessToken = t.accessToken
      session.user.refreshToken = t.refreshToken
      session.user.collaboratorId = t.collaboratorId
      session.user.clientId = t.clientId
      session.user.permissions = t.permissions ?? []
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
})
