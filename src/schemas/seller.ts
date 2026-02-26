import { z } from 'zod/v4'

export const createSellerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.email('Informe um e-mail válido'),
})

export type CreateSellerInput = z.infer<typeof createSellerSchema>
