import type { FastifyInstance, FastifyRequest } from 'fastify'
import { AnamnesisService } from './anamnesis.service.js'

const svc = new AnamnesisService()

function isAdmin(role: string) {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export async function anamnesisRoutes(app: FastifyInstance) {
  // POST /clients/:clientId/anamnesis — create anamnesis from default template (admin)
  app.post('/clients/:clientId/anamnesis', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdmin(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', statusCode: 403 })
      }
      const { clientId } = request.params as { clientId: string }
      try {
        const result = await svc.createForClient(clientId)
        return reply.code(201).send({ data: result })
      } catch (err) {
        const msg = (err as Error).message
        const code = msg.includes('já existe') ? 409 : msg.includes('não encontrado') ? 404 : 400
        return reply.code(code).send({ error: msg, statusCode: code })
      }
    },
  })

  // GET /clients/:clientId/anamnesis — get anamnesis with all sections/fields/responses
  app.get('/clients/:clientId/anamnesis', {
    handler: async (request: FastifyRequest, reply) => {
      const { clientId } = request.params as { clientId: string }
      const user = request.user

      // Admin can see any; client can only see their own
      if (!isAdmin(user.role)) {
        const { prisma } = await import('../../lib/prisma.js')
        const client = await prisma.client.findFirst({ where: { id: clientId, userId: user.sub } })
        if (!client) return reply.code(403).send({ error: 'Forbidden', statusCode: 403 })
      }

      try {
        const result = await svc.findByClient(clientId)
        return reply.send({ data: result })
      } catch (err) {
        return reply.code(404).send({ error: (err as Error).message, statusCode: 404 })
      }
    },
  })

  // GET /anamnesis/:id/progress — section progress summary
  app.get('/anamnesis/:id/progress', {
    handler: async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string }
      try {
        const result = await svc.getProgress(id)
        return reply.send({ data: result })
      } catch (err) {
        return reply.code(404).send({ error: (err as Error).message, statusCode: 404 })
      }
    },
  })

  // POST /anamnesis/:id/responses — save responses (batch upsert)
  app.post('/anamnesis/:id/responses', {
    handler: async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string }
      const { responses } = request.body as {
        responses: { fieldId: string; value?: string; fileUrl?: string }[]
      }

      if (!Array.isArray(responses) || responses.length === 0) {
        return reply.code(400).send({ error: 'responses é obrigatório', statusCode: 400 })
      }

      try {
        const result = await svc.saveResponses(id, responses)
        return reply.send({ data: result })
      } catch (err) {
        return reply.code(400).send({ error: (err as Error).message, statusCode: 400 })
      }
    },
  })
}
