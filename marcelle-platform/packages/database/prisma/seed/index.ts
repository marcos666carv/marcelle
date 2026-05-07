import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Super Admin — Marcelle
  const hashedPassword = await bcrypt.hash('marcelle@2025!', 12)

  const marcelle = await prisma.user.upsert({
    where: { email: 'marcellebreciani@gmail.com' },
    update: {},
    create: {
      email: 'marcellebreciani@gmail.com',
      name: 'Marcelle Breciani',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      collaborator: {
        create: {
          permissions: [
            'MANAGE_CLIENTS',
            'MANAGE_TASKS',
            'MANAGE_PLANS',
            'MANAGE_CONTENT',
            'VIEW_ANALYTICS',
            'MANAGE_TEAM',
          ],
        },
      },
    },
  })

  console.log(`✅ Super Admin criado: ${marcelle.email}`)

  // Admin de desenvolvimento
  const adminPassword = await bcrypt.hash('adminadmin', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@marcelle.com' },
    update: { password: adminPassword },
    create: {
      email: 'admin@marcelle.com',
      name: 'Admin',
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      collaborator: {
        create: {
          permissions: [
            'MANAGE_CLIENTS',
            'MANAGE_TASKS',
            'MANAGE_PLANS',
            'MANAGE_CONTENT',
            'VIEW_ANALYTICS',
            'MANAGE_TEAM',
          ],
        },
      },
    },
  })

  console.log(`✅ Admin dev criado: ${admin.email} / adminadmin`)

  // Demo Client
  const clientPassword = await bcrypt.hash('cliente@demo123', 12)
  const demoClient = await prisma.user.upsert({
    where: { email: 'cliente@demo.com' },
    update: {},
    create: {
      email: 'cliente@demo.com',
      name: 'Cliente Demo',
      password: clientPassword,
      role: UserRole.CLIENT,
      client: {
        create: {
          lifecyclePhase: 'SILENT_CHAOS',
          onboardingStatus: 'PENDING',
        },
      },
    },
  })

  console.log(`✅ Cliente demo criado: ${demoClient.email}`)
  console.log('✅ Seed concluído!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
