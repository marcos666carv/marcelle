import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

export const CreateCollaboratorSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  permissions: z.array(z.string()).default([]),
})

export const UpdateCollaboratorPermissionsSchema = z.object({
  permissions: z.array(z.string()),
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8, 'Nova senha deve ter ao menos 8 caracteres'),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type CreateCollaboratorInput = z.infer<typeof CreateCollaboratorSchema>
export type UpdateCollaboratorPermissionsInput = z.infer<typeof UpdateCollaboratorPermissionsSchema>
