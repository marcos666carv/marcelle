import type { FastifyInstance } from 'fastify'
import { authService } from './auth.service.js'
import { LoginSchema } from '@marcelle/validators'

export async function authRoutes(fastify: FastifyInstance) {
  // POST /auth/login
  fastify.post('/login', {
    config: { public: true },
    handler: async (request, reply) => {
      const result = LoginSchema.safeParse(request.body)
      if (!result.success) {
        return reply.code(400).send({
          error: 'Validation Error',
          message: result.error.errors[0]?.message ?? 'Dados inválidos',
          statusCode: 400,
        })
      }

      try {
        const { email, password } = result.data
        const data = await authService.login(email, password)
        return reply.code(200).send({ data })
      } catch (err) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: (err as Error).message,
          statusCode: 401,
        })
      }
    },
  })

  // POST /auth/refresh
  fastify.post('/refresh', {
    config: { public: true },
    handler: async (request, reply) => {
      const { refreshToken } = request.body as { refreshToken: string }
      if (!refreshToken) {
        return reply.code(400).send({ error: 'Bad Request', message: 'refreshToken obrigatório', statusCode: 400 })
      }

      try {
        const tokens = await authService.refresh(refreshToken)
        return reply.code(200).send({ data: tokens })
      } catch {
        return reply.code(401).send({ error: 'Unauthorized', message: 'Refresh token inválido', statusCode: 401 })
      }
    },
  })

  // POST /auth/logout
  fastify.post('/logout', {
    handler: async (request, reply) => {
      const token = request.headers.authorization?.slice(7) ?? ''
      await authService.logout(token)
      return reply.code(204).send()
    },
  })

  // GET /auth/me
  fastify.get('/me', {
    handler: async (request, reply) => {
      const user = await authService.me(request.user.sub)
      return reply.code(200).send({ data: user })
    },
  })

  // POST /auth/change-password
  fastify.post('/change-password', {
    handler: async (request, reply) => {
      const { currentPassword, newPassword } = request.body as {
        currentPassword: string
        newPassword: string
      }

      if (!currentPassword || !newPassword) {
        return reply.code(400).send({ error: 'Campos obrigatórios', statusCode: 400 })
      }
      if (newPassword.length < 8) {
        return reply.code(400).send({ error: 'A nova senha deve ter pelo menos 8 caracteres', statusCode: 400 })
      }

      try {
        await authService.changePassword(request.user.sub, currentPassword, newPassword)
        return reply.send({ data: { ok: true } })
      } catch (err) {
        return reply.code(400).send({ error: (err as Error).message, statusCode: 400 })
      }
    },
  })
}
