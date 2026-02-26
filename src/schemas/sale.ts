import { z } from 'zod/v4'

export const createSaleSchema = z.object({
  seller_id: z.coerce.number().int().positive('Selecione um vendedor'),
  value: z.coerce.number().positive('O valor deve ser maior que zero'),
  sale_date: z.string().min(1, 'Data da venda é obrigatória'),
  commission_rate: z.coerce.number().min(0, 'Mínimo é 0%').max(100, 'Máximo é 100%'),
})

export type CreateSaleInput = z.infer<typeof createSaleSchema>
