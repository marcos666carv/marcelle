import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { authHook } from './plugins/auth.plugin.js'
import { authRoutes } from './modules/auth/auth.routes.js'
import { collaboratorsRoutes } from './modules/collaborators/collaborators.routes.js'
import { clientRoutes } from './modules/clients/clients.routes.js'
import { anamnesisRoutes } from './modules/anamnesis/anamnesis.routes.js'
import { taskRoutes } from './modules/tasks/tasks.routes.js'
import { planRoutes } from './modules/plans/plans.routes.js'
import { dashboardRoutes } from './modules/dashboard/dashboard.routes.js'
import { notificationRoutes } from './modules/notifications/notifications.routes.js'
import { contentRoutes } from './modules/content/content.routes.js'

async function main() {
  const isDev = process.env['NODE_ENV'] !== 'production'

  const fastify = Fastify({
    logger: isDev ? { level: 'info' } : { level: 'warn' },
  })

  // Plugins
  await fastify.register(helmet, { contentSecurityPolicy: false })
  await fastify.register(cors, {
    origin: [process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'],
    credentials: true,
  })
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  // Auth hook — verifies JWT on all routes except those with config.public = true
  await fastify.register(authHook)

  // Health check (public)
  fastify.get('/health', { config: { public: true } }, async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env['NODE_ENV'],
  }))

  // Routes
  await fastify.register(authRoutes, { prefix: '/auth' })
  await fastify.register(collaboratorsRoutes, { prefix: '/collaborators' })
  await fastify.register(clientRoutes, { prefix: '/clients' })
  await fastify.register(anamnesisRoutes)
  await fastify.register(taskRoutes, { prefix: '/tasks' })
  await fastify.register(planRoutes, { prefix: '/plans' })
  await fastify.register(dashboardRoutes, { prefix: '/dashboard' })
  await fastify.register(notificationRoutes, { prefix: '/notifications' })
  await fastify.register(contentRoutes, { prefix: '/content' })

  // Start
  const PORT = parseInt(process.env['PORT'] ?? '3001', 10)
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' })
    console.log(`🚀 API rodando em http://localhost:${PORT}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
