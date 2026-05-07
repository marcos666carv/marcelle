import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma.js'
import { email } from '../../lib/email.js'
import type { Permission, AuthUser } from '@marcelle/types'

export class CollaboratorsService {
  async list() {
    return prisma.collaborator.findMany({
      include: {
        user: {
          select: { id: true, email: true, name: true, avatarUrl: true, isActive: true, createdAt: true },
        },
        _count: { select: { clients: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
  }

  async findById(id: string) {
    return prisma.collaborator.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, name: true, avatarUrl: true, isActive: true, createdAt: true },
        },
        _count: { select: { clients: true } },
      },
    })
  }

  async create(data: { name: string; email: string; permissions: string[] }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
    if (existingUser) {
      throw new Error('Email já cadastrado')
    }

    // Gera senha temporária
    const tempPassword = Math.random().toString(36).slice(-12)
    const hashedPassword = await bcrypt.hash(tempPassword, 12)

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        name: data.name,
        password: hashedPassword,
        role: 'ADMIN',
        collaborator: {
          create: {
            permissions: data.permissions,
          },
        },
      },
      include: { collaborator: true },
    })

    // Send welcome email (fire-and-forget — don't block response)
    email.welcomeCollaborator({ name: user.name, email: user.email, tempPassword }).catch(() => {})

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        collaboratorId: user.collaborator?.id,
      },
      tempPassword, // retorna apenas em dev para facilitar testes
    }
  }

  async updatePermissions(id: string, permissions: Permission[]) {
    return prisma.collaborator.update({
      where: { id },
      data: { permissions },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    })
  }

  async deactivate(id: string) {
    const collaborator = await prisma.collaborator.findUniqueOrThrow({
      where: { id },
      select: { userId: true },
    })

    await prisma.user.update({
      where: { id: collaborator.userId },
      data: { isActive: false },
    })
  }
}

export const collaboratorsService = new CollaboratorsService()
