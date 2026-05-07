import { prisma } from '../../lib/prisma.js'
import { errors } from '../../lib/errors.js'
import { createNotification } from '../notifications/notifications.routes.js'

interface ListTasksOptions {
  clientId?: string
  status?: string
  userId?: string // when set, filters by client owned by this user
}

interface CreateTaskInput {
  clientId: string
  collaboratorId: string
  title: string
  description?: string
  type?: string
  priority?: string
  dueDate?: string
  isRecurring?: boolean
  recurringRule?: unknown
  supportContent?: unknown
}

interface UpdateTaskInput {
  title?: string
  description?: string
  type?: string
  priority?: string
  status?: string
  dueDate?: string | null
  isRecurring?: boolean
  recurringRule?: unknown
  supportContent?: unknown
}

export class TaskService {
  async list(options: ListTasksOptions): Promise<any[]> {
    const where: Record<string, unknown> = {}

    if (options.clientId) {
      where['clientId'] = options.clientId
    }

    if (options.userId) {
      where['client'] = { userId: options.userId }
    }

    if (options.status) {
      where['status'] = options.status
    }

    return prisma.task.findMany({
      where,
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        collaborator: {
          include: { user: { select: { name: true } } },
        },
      },
    })
  }

  async create(input: CreateTaskInput): Promise<any> {
    const client = await prisma.client.findUnique({ where: { id: input.clientId }, include: { user: true } })
    if (!client) throw errors.notFound('Cliente')

    const task = await prisma.task.create({
      data: {
        clientId: input.clientId,
        collaboratorId: input.collaboratorId,
        title: input.title,
        description: input.description,
        type: (input.type as any) ?? 'CHECK',
        priority: (input.priority as any) ?? 'MEDIUM',
        ...(input.dueDate ? { dueDate: new Date(input.dueDate) } : {}),
        isRecurring: input.isRecurring ?? false,
        recurringRule: input.recurringRule ?? undefined,
        supportContent: input.supportContent ?? undefined,
      },
      include: {
        collaborator: {
          include: { user: { select: { name: true } } },
        },
      },
    })

    // Notify client about new task (fire-and-forget)
    createNotification({
      userId: client.userId,
      type: 'NEW_TASK',
      title: 'Nova tarefa criada',
      body: task.title,
      data: { taskId: task.id } as Record<string, string>,
    }).catch(() => {})

    return task
  }

  async findById(id: string): Promise<any> {
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) throw errors.notFound('Tarefa')
    return task
  }

  async update(id: string, input: UpdateTaskInput): Promise<any> {
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) throw errors.notFound('Tarefa')

    return prisma.task.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.type ? { type: input.type as any } : {}),
        ...(input.priority ? { priority: input.priority as any } : {}),
        ...(input.status ? { status: input.status as any } : {}),
        ...(input.dueDate !== undefined
          ? { dueDate: input.dueDate ? new Date(input.dueDate) : null }
          : {}),
        ...(input.isRecurring !== undefined ? { isRecurring: input.isRecurring } : {}),
        ...(input.recurringRule !== undefined && input.recurringRule !== null
          ? { recurringRule: input.recurringRule as any }
          : {}),
        ...(input.supportContent !== undefined && input.supportContent !== null
          ? { supportContent: input.supportContent as any }
          : {}),
      },
    })
  }

  async complete(id: string, userId?: string): Promise<any> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { client: true },
    })
    if (!task) throw errors.notFound('Tarefa')

    // If userId provided, ensure this task belongs to that user's client
    if (userId && task.client.userId !== userId) {
      throw errors.forbidden()
    }

    return prisma.task.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })
  }

  async skip(id: string): Promise<any> {
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) throw errors.notFound('Tarefa')

    return prisma.task.update({
      where: { id },
      data: { status: 'SKIPPED' },
    })
  }

  async delete(id: string) {
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) throw errors.notFound('Tarefa')
    await prisma.task.delete({ where: { id } })
  }
}
