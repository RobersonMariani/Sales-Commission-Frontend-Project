import { z } from 'zod/v4'

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: z.email('Informe um e-mail válido'),
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    password_confirmation: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'As senhas não conferem',
    path: ['password_confirmation'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
