import { describe, it, expect } from 'vitest'
import { createSellerSchema } from '@/schemas/seller'

describe('createSellerSchema', () => {
  it('valida dados corretos', () => {
    const result = createSellerSchema.safeParse({
      name: 'John Seller',
      email: 'john@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita nome vazio', () => {
    const result = createSellerSchema.safeParse({
      name: '',
      email: 'john@example.com',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita e-mail inválido', () => {
    const result = createSellerSchema.safeParse({
      name: 'John Seller',
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita nome com mais de 100 caracteres', () => {
    const result = createSellerSchema.safeParse({
      name: 'A'.repeat(101),
      email: 'john@example.com',
    })
    expect(result.success).toBe(false)
  })
})
