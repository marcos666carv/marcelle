import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma.js'
import { signAccessToken, signRefreshToken, verifyToken } from '../../lib/jwt.js'
import type { UserRole, Permission, AuthUser } from '@marcelle/types'

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        collaborator: true,
        client: true,
      },
    })

    if (!user || !user.isActive) {
      throw new Error('Credenciais inválidas')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new Error('Credenciais inválidas')
    }

    const permissions = (user.collaborator?.permissions ?? []) as Permission[]

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
      ...(user.collaborator && { collaboratorId: user.collaborator.id }),
      ...(user.client && { clientId: user.client.id }),
      permissions,
    }

    const accessToken = signAccessToken(tokenPayload)
    const refreshToken = signRefreshToken(user.id)

    // Salva sessão
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      },
    })

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role as UserRole,
      ...(user.collaborator && { collaboratorId: user.collaborator.id }),
      ...(user.client && { clientId: user.client.id }),
      permissions,
    }

    return { accessToken, refreshToken, user: authUser }
  }

  async refresh(refreshToken: string) {
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: {
        user: {
          include: { collaborator: true, client: true },
        },
      },
    })

    if (!session || session.expiresAt < new Date()) {
      throw new Error('Refresh token inválido ou expirado')
    }

    const { user } = session
    const permissions = (user.collaborator?.permissions ?? []) as Permission[]

    const newAccessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
      ...(user.collaborator && { collaboratorId: user.collaborator.id }),
      ...(user.client && { clientId: user.client.id }),
      permissions,
    })
    const newRefreshToken = signRefreshToken(user.id)

    // Rotate refresh token
    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  async logout(token: string) {
    await prisma.session.deleteMany({ where: { token } })
  }

  async me(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { collaborator: true, client: true },
    })

    const permissions = (user.collaborator?.permissions ?? []) as Permission[]

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role as UserRole,
      ...(user.collaborator && { collaboratorId: user.collaborator.id }),
      ...(user.client && { clientId: user.client.id }),
      permissions,
    }
  }
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('Usuário não encontrado')

    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) throw new Error('Senha atual incorreta')

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } })
  }
}

export const authService = new AuthService()
