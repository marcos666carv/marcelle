import type { FastifyInstance, FastifyRequest } from 'fastify'
import { PlanService } from './plans.service.js'

const planService = new PlanService()

function isAdminRole(role: string) {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export async function planRoutes(app: FastifyInstance) {
  // GET /plans/client/:clientId — get plan for a client
  app.get('/client/:clientId', {
    handler: async (request: FastifyRequest, reply) => {
      const { clientId } = request.params as { clientId: string }
      const isAdmin = isAdminRole(request.user.role)

      try {
        const plan = await planService.findByClient(
          clientId,
          isAdmin ? undefined : request.user.sub,
        )
        return reply.send({ data: plan })
      } catch (err) {
        const code = (err as any).statusCode ?? 404
        return reply.code(code).send({
          error: 'Error',
          message: (err as Error).message,
          statusCode: code,
        })
      }
    },
  })

  // POST /plans — create plan (admin only)
  app.post('/', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdminRole(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', message: 'Sem permissão', statusCode: 403 })
      }

      const body = request.body as {
        clientId: string
        title?: string
        description?: string
        goals?: unknown[]
      }

      try {
        const plan = await planService.create({
          ...body,
          collaboratorId: request.user.collaboratorId ?? request.user.sub,
          goals: body.goals as any,
        })
        return reply.status(201).send({ data: plan })
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

  // PATCH /plans/:id — update plan (admin only)
  app.patch('/:id', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdminRole(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', message: 'Sem permissão', statusCode: 403 })
      }

      const { id } = request.params as { id: string }
      const body = request.body as Record<string, unknown>

      try {
        const plan = await planService.update(id, body as any)
        return reply.send({ data: plan })
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
}
