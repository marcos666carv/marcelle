import type { FastifyInstance, FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma.js'
import { errors } from '../../lib/errors.js'

function isAdmin(role: string) {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export async function contentRoutes(app: FastifyInstance) {
  // GET /content — list published content (clients) or all (admin)
  app.get('/', {
    handler: async (request: FastifyRequest, reply) => {
      const user = request.user
      const { type, tag, search } = request.query as {
        type?: string
        tag?: string
        search?: string
      }

      const where: Record<string, unknown> = {}
      if (!isAdmin(user.role)) {
        where['isPublished'] = true
      }
      if (type) where['type'] = type
      if (tag) where['tags'] = { has: tag }
      if (search) where['title'] = { contains: search, mode: 'insensitive' }

      const items = await prisma.content.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { include: { user: { select: { name: true } } } },
        },
      })

      return reply.send({ data: items })
    },
  })

  // GET /content/:id — single item
  app.get('/:id', {
    handler: async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string }
      const user = request.user

      const item = await prisma.content.findUnique({
        where: { id },
        include: {
          createdBy: { include: { user: { select: { name: true } } } },
        },
      })

      if (!item) return reply.code(404).send({ error: 'Não encontrado', statusCode: 404 })
      if (!isAdmin(user.role) && !item.isPublished) {
        return reply.code(403).send({ error: 'Forbidden', statusCode: 403 })
      }

      return reply.send({ data: item })
    },
  })

  // POST /content — create (admin only)
  app.post('/', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdmin(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', statusCode: 403 })
      }

      const collaborator = await prisma.collaborator.findFirst({
        where: { userId: request.user.sub },
      })
      if (!collaborator) {
        return reply.code(403).send({ error: 'Colaborador não encontrado', statusCode: 403 })
      }

      const body = request.body as {
        title: string
        description?: string
        type?: string
        url?: string
        body?: string
        tags?: string[]
        isPublished?: boolean
      }

      if (!body.title?.trim()) {
        return reply.code(400).send({ error: 'Título é obrigatório', statusCode: 400 })
      }

      const item = await prisma.content.create({
        data: {
          title: body.title.trim(),
          description: body.description?.trim(),
          type: (body.type as any) ?? 'ARTICLE',
          url: body.url?.trim() || undefined,
          body: body.body?.trim() || undefined,
          tags: body.tags ?? [],
          isPublished: body.isPublished ?? false,
          createdById: collaborator.id,
        },
        include: {
          createdBy: { include: { user: { select: { name: true } } } },
        },
      })

      return reply.code(201).send({ data: item })
    },
  })

  // PATCH /content/:id — update (admin only)
  app.patch('/:id', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdmin(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', statusCode: 403 })
      }

      const { id } = request.params as { id: string }
      const item = await prisma.content.findUnique({ where: { id } })
      if (!item) return reply.code(404).send({ error: 'Não encontrado', statusCode: 404 })

      const body = request.body as Record<string, unknown>

      const updated = await prisma.content.update({
        where: { id },
        data: {
          ...(body['title'] !== undefined ? { title: String(body['title']).trim() } : {}),
          ...(body['description'] !== undefined ? { description: body['description'] ? String(body['description']).trim() : null } : {}),
          ...(body['type'] !== undefined ? { type: body['type'] as any } : {}),
          ...(body['url'] !== undefined ? { url: body['url'] ? String(body['url']).trim() : null } : {}),
          ...(body['body'] !== undefined ? { body: body['body'] ? String(body['body']).trim() : null } : {}),
          ...(body['tags'] !== undefined ? { tags: body['tags'] as string[] } : {}),
          ...(body['isPublished'] !== undefined ? { isPublished: Boolean(body['isPublished']) } : {}),
        },
        include: {
          createdBy: { include: { user: { select: { name: true } } } },
        },
      })

      return reply.send({ data: updated })
    },
  })

  // DELETE /content/:id — delete (admin only)
  app.delete('/:id', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdmin(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', statusCode: 403 })
      }

      const { id } = request.params as { id: string }
      const item = await prisma.content.findUnique({ where: { id } })
      if (!item) return reply.code(404).send({ error: 'Não encontrado', statusCode: 404 })

      await prisma.content.delete({ where: { id } })
      return reply.send({ data: { ok: true } })
    },
  })
}
