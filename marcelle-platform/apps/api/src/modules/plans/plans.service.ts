import { prisma } from '../../lib/prisma.js'
import { errors } from '../../lib/errors.js'

interface Goal {
  id: string
  title: string
  description?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE'
}

interface CreatePlanInput {
  clientId: string
  collaboratorId: string
  title?: string
  description?: string
  goals?: Goal[]
}

interface UpdatePlanInput {
  title?: string
  description?: string
  status?: string
  goals?: Goal[]
}

export class PlanService {
  async findByClient(clientId: string, userId?: string): Promise<any> {
    if (userId) {
      // Verify the client belongs to this user
      const client = await prisma.client.findFirst({ where: { id: clientId, userId } })
      if (!client) throw errors.forbidden()
    }

    const plan = await prisma.plan.findUnique({
      where: { clientId },
      include: {
        collaborator: {
          include: { user: { select: { name: true } } },
        },
      },
    })

    if (!plan) throw errors.notFound('Plano')
    return plan
  }

  async create(input: CreatePlanInput): Promise<any> {
    const client = await prisma.client.findUnique({ where: { id: input.clientId } })
    if (!client) throw errors.notFound('Cliente')

    const existing = await prisma.plan.findUnique({ where: { clientId: input.clientId } })
    if (existing) throw errors.conflict('Este cliente já possui um plano')

    return prisma.plan.create({
      data: {
        clientId: input.clientId,
        collaboratorId: input.collaboratorId,
        title: input.title ?? 'Plano Financeiro Pessoal',
        description: input.description,
        status: 'ACTIVE',
        goals: (input.goals as any) ?? [],
      },
      include: {
        collaborator: {
          include: { user: { select: { name: true } } },
        },
      },
    })
  }

  async update(id: string, input: UpdatePlanInput): Promise<any> {
    const plan = await prisma.plan.findUnique({ where: { id } })
    if (!plan) throw errors.notFound('Plano')

    return prisma.plan.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.status ? { status: input.status as any } : {}),
        ...(input.goals !== undefined ? { goals: input.goals as any } : {}),
      },
    })
  }
}
