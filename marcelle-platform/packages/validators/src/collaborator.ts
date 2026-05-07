import { z } from 'zod'

export const createCollaboratorSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  permissions: z
    .array(
      z.enum([
        'MANAGE_CLIENTS',
        'MANAGE_TASKS',
        'MANAGE_PLANS',
        'MANAGE_CONTENT',
        'VIEW_ANALYTICS',
        'MANAGE_TEAM',
      ])
    )
    .default([]),
})

export type CreateCollaboratorInput = z.infer<typeof createCollaboratorSchema>

export const updatePermissionsSchema = z.object({
  permissions: z.array(
    z.enum([
      'MANAGE_CLIENTS',
      'MANAGE_TASKS',
      'MANAGE_PLANS',
      'MANAGE_CONTENT',
      'VIEW_ANALYTICS',
      'MANAGE_TEAM',
    ])
  ),
})

export type UpdatePermissionsInput = z.infer<typeof updatePermissionsSchema>
