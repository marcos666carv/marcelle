import { z } from 'zod'

export const createTaskSchema = z.object({
  clientId: z.string().cuid(),
  title: z.string().min(3, 'Titulo deve ter no minimo 3 caracteres'),
  description: z.string().optional(),
  type: z.enum(['CHECK', 'ACTION', 'REFLECTION', 'UPLOAD', 'READING']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
  isRecurring: z.boolean().default(false),
  recurringRule: z
    .object({
      frequency: z.enum(['WEEKLY', 'MONTHLY']),
      interval: z.number().int().positive().default(1),
    })
    .optional(),
  supportContent: z
    .object({
      links: z
        .array(
          z.object({
            label: z.string(),
            url: z.string().url(),
          })
        )
        .optional(),
    })
    .optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
