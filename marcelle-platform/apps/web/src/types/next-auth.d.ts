import type { DefaultSession } from 'next-auth'
import type { UserRole, Permission } from '@marcelle/types'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      accessToken: string
      refreshToken?: string
      collaboratorId?: string
      clientId?: string
      permissions: Permission[]
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: UserRole
    accessToken: string
    refreshToken: string
    collaboratorId?: string
    clientId?: string
    permissions: Permission[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    accessToken: string
    refreshToken: string
    collaboratorId?: string
    clientId?: string
    permissions: Permission[]
  }
}
