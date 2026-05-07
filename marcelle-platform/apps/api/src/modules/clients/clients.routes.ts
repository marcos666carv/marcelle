import type { FastifyInstance, FastifyRequest } from 'fastify'
import { ClientService } from './clients.service.js'

const clientService = new ClientService()

function isAdminRole(role: string) {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

function hasPermission(permissions: string[], permission: string) {
  return permissions?.includes(permission)
}

export async function clientRoutes(app: FastifyInstance) {
  // GET /clients — list (admin only)
  app.get('/', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdminRole(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', message: 'Sem permissão', statusCode: 403 })
      }

      const query = request.query as {
        page?: string
        limit?: string
        lifecyclePhase?: string
        collaboratorId?: string
        search?: string
      }

      const clients = await clientService.list({
        page: parseInt(query.page ?? '1'),
        limit: parseInt(query.limit ?? '20'),
        lifecyclePhase: query.lifecyclePhase,
        collaboratorId: query.collaboratorId,
        search: query.search,
      })

      return reply.send(clients)
    },
  })

  // POST /clients — create client (admin only)
  app.post('/', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdminRole(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', message: 'Sem permissão', statusCode: 403 })
      }

      const body = request.body as {
        name: string
        email: string
        phone?: string
        birthDate?: string
        occupation?: string
        collaboratorId?: string
      }

      try {
        const client = await clientService.create(body)
        return reply.status(201).send({ data: client })
      } catch (err) {
        return reply.code(400).send({
          error: 'Bad Request',
          message: (err as Error).message,
          statusCode: 400,
        })
      }
    },
  })

  // GET /clients/:id — client detail (admin or own client)
  app.get('/:id', {
    handler: async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string }
      const isAdmin = isAdminRole(request.user.role)

      try {
        const client = await clientService.findById(id, isAdmin ? undefined : request.user.sub)
        return reply.send({ data: client })
      } catch (err) {
        return reply.code(404).send({
          error: 'Not Found',
          message: (err as Error).message,
          statusCode: 404,
        })
      }
    },
  })

  // PATCH /clients/:id — update (admin only)
  app.patch('/:id', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdminRole(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', message: 'Sem permissão', statusCode: 403 })
      }

      const { id } = request.params as { id: string }
      const body = request.body as Record<string, unknown>

      try {
        const client = await clientService.update(id, body)
        return reply.send({ data: client })
      } catch (err) {
        return reply.code(400).send({
          error: 'Bad Request',
          message: (err as Error).message,
          statusCode: 400,
        })
      }
    },
  })
}
