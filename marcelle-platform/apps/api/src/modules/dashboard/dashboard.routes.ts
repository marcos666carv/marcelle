import type { FastifyInstance, FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma.js'

function isAdmin(role: string) {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export async function dashboardRoutes(app: FastifyInstance) {
  // GET /dashboard/stats — aggregated KPIs (admin only)
  app.get('/stats', {
    handler: async (request: FastifyRequest, reply) => {
      if (!isAdmin(request.user.role)) {
        return reply.code(403).send({ error: 'Forbidden', statusCode: 403 })
      }

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const [
        totalClients,
        newClientsThisMonth,
        clientsByPhase,
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
        totalAnamneses,
        completedAnamneses,
        inProgressAnamneses,
        totalPlans,
        activePlans,
        draftPlans,
        recentClients,
        recentCompletedTasks,
      ] = await Promise.all([
        prisma.client.count(),
        prisma.client.count({ where: { createdAt: { gte: startOfMonth } } }),
        prisma.client.groupBy({ by: ['lifecyclePhase'], _count: { _all: true } }),
        prisma.task.count(),
        prisma.task.count({ where: { status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
        prisma.task.count({ where: { status: 'COMPLETED' } }),
        prisma.task.count({
          where: {
            status: { in: ['PENDING', 'IN_PROGRESS'] },
            dueDate: { lt: now, not: null },
          },
        }),
        prisma.anamnesis.count(),
        prisma.anamnesis.count({ where: { status: 'COMPLETED' } }),
        prisma.anamnesis.count({ where: { status: 'IN_PROGRESS' } }),
        prisma.plan.count(),
        prisma.plan.count({ where: { status: 'ACTIVE' } }),
        prisma.plan.count({ where: { status: 'DRAFT' } }),
        prisma.client.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true, email: true } },
          },
        }),
        prisma.task.findMany({
          where: { status: 'COMPLETED', completedAt: { not: null } },
          take: 5,
          orderBy: { completedAt: 'desc' },
          include: {
            client: {
              include: { user: { select: { name: true } } },
            },
          },
        }),
      ])

      const phaseMap: Record<string, number> = {}
      for (const row of clientsByPhase) {
        phaseMap[row.lifecyclePhase] = row._count._all
      }

      return reply.send({
        data: {
          clients: {
            total: totalClients,
            newThisMonth: newClientsThisMonth,
            byPhase: phaseMap,
          },
          tasks: {
            total: totalTasks,
            pending: pendingTasks,
            completed: completedTasks,
            overdue: overdueTasks,
            completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          },
          anamneses: {
            total: totalAnamneses,
            completed: completedAnamneses,
            inProgress: inProgressAnamneses,
            notStarted: totalAnamneses - completedAnamneses - inProgressAnamneses,
            completionRate: totalAnamneses > 0 ? Math.round((completedAnamneses / totalAnamneses) * 100) : 0,
          },
          plans: {
            total: totalPlans,
            active: activePlans,
            draft: draftPlans,
            completed: totalPlans - activePlans - draftPlans,
          },
          recentClients,
          recentCompletedTasks,
        },
      })
    },
  })
}
