import type { FastifyInstance } from 'fastify'
import { collaboratorsService } from './collaborators.service.js'
import { CreateCollaboratorSchema, UpdateCollaboratorPermissionsSchema } from '@marcelle/validators'

export async function collaboratorsRoutes(fastify: FastifyInstance) {
  // GET /collaborators
  fastify.get('/', {
    preHandler: async (req, reply) => {
      if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN') {
        return reply.code(403).send({ error: 'Forbidden', message: 'Sem permissão', statusCode: 403 })
      }
    },
    handler: async (_req, reply) => {
      const collaborators = await collaboratorsService.list()
      return reply.send({ data: collaborators })
    },
  })

  // POST /collaborators — Super Admin only
  fastify.post('/', {
    preHandler: async (req, reply) => {
      if (req.user.role !== 'SUPER_ADMIN') {
        return reply.code(403).send({ error: 'Forbidden', message: 'Apenas Super Admin', statusCode: 403 })
      }
    },
    handler: async (request, reply) => {
      const result = CreateCollaboratorSchema.safeParse(request.body)
      if (!result.success) {
        return reply.code(400).send({
          error: 'Validation Error',
          message: result.error.errors[0]?.message,
          statusCode: 400,
        })
      }

      try {
        const data = await collaboratorsService.create(result.data)
        return reply.code(201).send({ data })
      } catch (err) {
        return reply.code(400).send({ error: 'Bad Request', message: (err as Error).message, statusCode: 400 })
      }
    },
  })

  // GET /collaborators/:id
  fastify.get('/:id', {
    preHandler: async (req, reply) => {
      if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN') {
        return reply.code(403).send({ error: 'Forbidden', message: 'Sem permissão', statusCode: 403 })
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      try {
        const collaborator = await collaboratorsService.findById(id)
        return reply.send({ data: collaborator })
      } catch {
        return reply.code(404).send({ error: 'Not Found', message: 'Colaborador não encontrado', statusCode: 404 })
      }
    },
  })

  // PATCH /collaborators/:id/permissions — Super Admin only
  fastify.patch('/:id/permissions', {
    preHandler: async (req, reply) => {
      if (req.user.role !== 'SUPER_ADMIN') {
        return reply.code(403).send({ error: 'Forbidden', message: 'Apenas Super Admin', statusCode: 403 })
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const result = UpdateCollaboratorPermissionsSchema.safeParse(request.body)
      if (!result.success) {
        return reply.code(400).send({ error: 'Validation Error', message: 'Permissões inválidas', statusCode: 400 })
      }

      try {
        const updated = await collaboratorsService.updatePermissions(id, result.data.permissions as any)
        return reply.send({ data: updated })
      } catch {
        return reply.code(404).send({ error: 'Not Found', message: 'Colaborador não encontrado', statusCode: 404 })
      }
    },
  })

  // DELETE /collaborators/:id — deactivate
  fastify.delete('/:id', {
    preHandler: async (req, reply) => {
      if (req.user.role !== 'SUPER_ADMIN') {
        return reply.code(403).send({ error: 'Forbidden', message: 'Apenas Super Admin', statusCode: 403 })
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      try {
        await collaboratorsService.deactivate(id)
        return reply.code(204).send()
      } catch {
        return reply.code(404).send({ error: 'Not Found', message: 'Colaborador não encontrado', statusCode: 404 })
      }
    },
  })
}
