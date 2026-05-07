import type { FastifyInstance, FastifyRequest } from 'fastify'
import { TaskService } from './tasks.service.js'

const taskService = new TaskService()

function isAdminRole(role: string) {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export async function taskRoutes(app: FastifyInstance) {
  // GET /tasks — list tasks
  // Admin: filter by clientId; Client: own tasks only
  app.get('/', {
    handler: async (request: FastifyRequest, reply) => {
      const query = request.query as { clientId?: string; status?: string }
      const isAdmin = isAdminRole(request.user.role)

      const tasks = await taskService.list({
        clientId: isAdmin ? query.clientId : undefined,
        userId: isAdmin ? undefined : request.user.sub,
        status: query.status,
      })

      return reply.send({ data: tasks })
    },
  })

  // POST /tasks — create task (admin only)
  app.post('/', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdminRole(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', message: 'Sem permissão', statusCode: 403 })
      }

      const body = request.body as {
        clientId: string
        title: string
        description?: string
        type?: string
        priority?: string
        dueDate?: string
        isRecurring?: boolean
        recurringRule?: unknown
        supportContent?: unknown
      }

      try {
        const task = await taskService.create({
          ...body,
          collaboratorId: request.user.collaboratorId ?? request.user.sub,
        })
        return reply.status(201).send({ data: task })
      } catch (err) {
        return reply.code(400).send({
          error: 'Bad Request',
          message: (err as Error).message,
          statusCode: 400,
        })
      }
    },
  })

  // PATCH /tasks/:id — update task (admin only)
  app.patch('/:id', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdminRole(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', message: 'Sem permissão', statusCode: 403 })
      }

      const { id } = request.params as { id: string }
      const body = request.body as Record<string, unknown>

      try {
        const task = await taskService.update(id, body)
        return reply.send({ data: task })
      } catch (err) {
        return reply.code(400).send({
          error: 'Bad Request',
          message: (err as Error).message,
          statusCode: 400,
        })
      }
    },
  })

  // PATCH /tasks/:id/complete — mark task as completed (client or admin)
  app.patch('/:id/complete', {
    handler: async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string }
      const isAdmin = isAdminRole(request.user.role)

      try {
        const task = await taskService.complete(id, isAdmin ? undefined : request.user.sub)
        return reply.send({ data: task })
      } catch (err) {
        const code = (err as any).statusCode ?? 400
        return reply.code(code).send({
          error: 'Error',
          message: (err as Error).message,
          statusCode: code,
        })
      }
    },
  })

  // PATCH /tasks/:id/skip — skip task (admin only)
  app.patch('/:id/skip', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdminRole(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', message: 'Sem permissão', statusCode: 403 })
      }

      const { id } = request.params as { id: string }

      try {
        const task = await taskService.skip(id)
        return reply.send({ data: task })
      } catch (err) {
        return reply.code(404).send({
          error: 'Not Found',
          message: (err as Error).message,
          statusCode: 404,
        })
      }
    },
  })

  // DELETE /tasks/:id — delete task (admin only)
  app.delete('/:id', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdminRole(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', message: 'Sem permissão', statusCode: 403 })
      }

      const { id } = request.params as { id: string }

      try {
        await taskService.delete(id)
        return reply.code(204).send()
      } catch (err) {
        return reply.code(404).send({
          error: 'Not Found',
          message: (err as Error).message,
          statusCode: 404,
        })
      }
    },
  })
}
