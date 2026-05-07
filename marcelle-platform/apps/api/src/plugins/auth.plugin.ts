import type { FastifyInstance, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { verifyToken } from '../lib/jwt.js'
import type { TokenPayload, Permission } from '@marcelle/types'

declare module 'fastify' {
  interface FastifyRequest {
    user: TokenPayload
  }
}

async function authPlugin(fastify: FastifyInstance) {
  // @ts-expect-error — decorated in onRequest hook before route handlers run
  fastify.decorateRequest('user', null)

  fastify.addHook('onRequest', async (request: FastifyRequest, reply) => {
    const routeConfig = (request.routeOptions.config as unknown) as Record<string, unknown>
    if (routeConfig?.['public'] === true) return

    const authHeader = request.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Unauthorized', message: 'Token não fornecido', statusCode: 401 })
    }

    const token = authHeader.slice(7)
    try {
      const payload = verifyToken(token)
      request.user = payload
    } catch {
      return reply.code(401).send({ error: 'Unauthorized', message: 'Token inválido ou expirado', statusCode: 401 })
    }
  })
}

export const authHook = fp(authPlugin)

// Role guard decorator
export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: ReturnType<typeof request.server.inject>) => {
    if (!roles.includes(request.user.role)) {
      // @ts-ignore
      return reply.code(403).send({ error: 'Forbidden', message: 'Sem permissão', statusCode: 403 })
    }
  }
}

// Permission guard
export function requirePermission(permission: Permission) {
  return async (request: FastifyRequest, reply: ReturnType<typeof request.server.inject>) => {
    const permissions = request.user.permissions ?? []
    if (!permissions.includes(permission)) {
      // @ts-ignore
      return reply.code(403).send({ error: 'Forbidden', message: 'Permissão insuficiente', statusCode: 403 })
    }
  }
}
