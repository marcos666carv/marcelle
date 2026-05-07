import { z } from 'zod'

export const createClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no minimo 2 caracteres'),
  email: z.string().email('Email invalido'),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  occupation: z.string().optional(),
  monthlyIncome: z.number().positive().optional(),
  collaboratorId: z.string().cuid().optional(),
})

export type CreateClientInput = z.infer<typeof createClientSchema>

export const updateClientSchema = createClientSchema.partial().extend({
  lifecyclePhase: z
    .enum([
      'SILENT_CHAOS',
      'INITIAL_CLARITY',
      'ACTIVE_CONSTRUCTION',
      'EXPANSION_FREEDOM',
      'FULLNESS_AMBASSADOR',
    ])
    .optional(),
  internalNotes: z.string().optional(),
})

export type UpdateClientInput = z.infer<typeof updateClientSchema>
