import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma.js'
import { errors } from '../../lib/errors.js'
import { email } from '../../lib/email.js'

interface ListClientsOptions {
  page: number
  limit: number
  lifecyclePhase?: string
  collaboratorId?: string
  search?: string
}

interface CreateClientInput {
  name: string
  email: string
  phone?: string
  birthDate?: string
  occupation?: string
  monthlyIncome?: number
  collaboratorId?: string
}

export class ClientService {
  async list(options: ListClientsOptions) {
    const { page, limit, lifecyclePhase, collaboratorId, search } = options
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (lifecyclePhase) where['lifecyclePhase'] = lifecyclePhase
    if (collaboratorId) where['collaboratorId'] = collaboratorId
    if (search) {
      where['user'] = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    }

    const [data, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          collaborator: {
            include: {
              user: { select: { name: true } },
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.client.count({ where }),
    ])

    return {
      data,
      total,
      page,
      limit,
      hasMore: skip + data.length < total,
    }
  }

  async create(input: CreateClientInput) {
    const exists = await prisma.user.findUnique({ where: { email: input.email } })
    if (exists) throw errors.conflict('Email já cadastrado')

    // Gera senha temporária (será alterada no primeiro acesso)
    const tempPassword = Math.random().toString(36).slice(-12)
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    const newUser = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: hashedPassword,
        role: 'CLIENT',
        client: {
          create: {
            phone: input.phone,
            occupation: input.occupation,
            ...(input.birthDate ? { birthDate: new Date(input.birthDate) } : {}),
            collaboratorId: input.collaboratorId,
          },
        },
      },
      include: {
        client: {
          include: {
            collaborator: {
              include: { user: { select: { name: true } } },
            },
          },
        },
      },
    })

    // Send welcome email (fire-and-forget)
    email.welcomeClient({ name: newUser.name, email: newUser.email, tempPassword }).catch(() => {})

    return newUser
  }

  async findById(id: string, userId?: string) {
    const where: Record<string, unknown> = { id }
    if (userId) where['userId'] = userId

    const client = await prisma.client.findFirst({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
        },
        collaborator: {
          include: { user: { select: { name: true, email: true } } },
        },
        plans: { select: { id: true, status: true }, take: 1, orderBy: { createdAt: 'desc' } },
        _count: {
          select: { tasks: true },
        },
      },
    })

    if (!client) throw errors.notFound('Cliente')
    return client
  }

  async update(id: string, input: Record<string, unknown>) {
    const client = await prisma.client.findUnique({ where: { id } })
    if (!client) throw errors.notFound('Cliente')

    return prisma.client.update({
      where: { id },
      data: {
        ...(input['phone'] !== undefined ? { phone: input['phone'] as string } : {}),
        ...(input['lifecyclePhase'] ? { lifecyclePhase: input['lifecyclePhase'] as any } : {}),
        ...(input['internalNotes'] !== undefined ? { internalNotes: input['internalNotes'] as string } : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })
  }
}
