import type { FastifyInstance, FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma.js'

export async function notificationRoutes(app: FastifyInstance) {
  // GET /notifications — list for current user (last 30, unread first)
  app.get('/', {
    handler: async (request: FastifyRequest, reply) => {
      const userId = request.user.sub

      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: [{ readAt: 'asc' }, { createdAt: 'desc' }],
        take: 30,
      })

      const unreadCount = await prisma.notification.count({
        where: { userId, readAt: null },
      })

      return reply.send({ data: { notifications, unreadCount } })
    },
  })

  // PATCH /notifications/:id/read — mark one as read
  app.patch('/:id/read', {
    handler: async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string }
      const userId = request.user.sub

      const n = await prisma.notification.findFirst({ where: { id, userId } })
      if (!n) return reply.code(404).send({ error: 'Not found', statusCode: 404 })

      await prisma.notification.update({
        where: { id },
        data: { readAt: new Date() },
      })

      return reply.send({ data: { ok: true } })
    },
  })

  // PATCH /notifications/read-all — mark all as read
  app.patch('/read-all', {
    handler: async (request: FastifyRequest, reply) => {
      const userId = request.user.sub

      await prisma.notification.updateMany({
        where: { userId, readAt: null },
        data: { readAt: new Date() },
      })

      return reply.send({ data: { ok: true } })
    },
  })
}

// Helper — create a notification (used internally by other services)
export async function createNotification(opts: {
  userId: string
  type: string
  title: string
  body: string
  data?: Record<string, string>
}): Promise<void> {
  await prisma.notification.create({
    data: {
      userId: opts.userId,
      type: opts.type,
      title: opts.title,
      body: opts.body,
      data: opts.data,
    },
  })
}
