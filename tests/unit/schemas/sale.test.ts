import { describe, it, expect } from 'vitest'
import { createSaleSchema } from '@/schemas/sale'

describe('createSaleSchema', () => {
  it('valida dados corretos', () => {
    const result = createSaleSchema.safeParse({
      seller_id: 1,
      value: 100.5,
      sale_date: '2025-02-25',
      commission_rate: 8.5,
    })
    expect(result.success).toBe(true)
  })

  it('aceita valores como string (coerce)', () => {
    const result = createSaleSchema.safeParse({
      seller_id: '1',
      value: '100.50',
      sale_date: '2025-02-25',
      commission_rate: '8.5',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita seller_id zero', () => {
    const result = createSaleSchema.safeParse({
      seller_id: 0,
      value: 100,
      sale_date: '2025-02-25',
      commission_rate: 8.5,
    })
    expect(result.success).toBe(false)
  })

  it('rejeita valor negativo', () => {
    const result = createSaleSchema.safeParse({
      seller_id: 1,
      value: -10,
      sale_date: '2025-02-25',
      commission_rate: 8.5,
    })
    expect(result.success).toBe(false)
  })

  it('rejeita data vazia', () => {
    const result = createSaleSchema.safeParse({
      seller_id: 1,
      value: 100,
      sale_date: '',
      commission_rate: 8.5,
    })
    expect(result.success).toBe(false)
  })

  it('rejeita commission_rate negativa', () => {
    const result = createSaleSchema.safeParse({
      seller_id: 1,
      value: 100,
      sale_date: '2025-02-25',
      commission_rate: -1,
    })
    expect(result.success).toBe(false)
  })

  it('rejeita commission_rate acima de 100', () => {
    const result = createSaleSchema.safeParse({
      seller_id: 1,
      value: 100,
      sale_date: '2025-02-25',
      commission_rate: 101,
    })
    expect(result.success).toBe(false)
  })

  it('aceita commission_rate zero', () => {
    const result = createSaleSchema.safeParse({
      seller_id: 1,
      value: 100,
      sale_date: '2025-02-25',
      commission_rate: 0,
    })
    expect(result.success).toBe(true)
  })
})
