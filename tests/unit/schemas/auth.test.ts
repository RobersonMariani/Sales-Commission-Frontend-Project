import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '@/schemas/auth'

describe('loginSchema', () => {
  it('valida dados corretos', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12345678',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita e-mail inválido', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: '12345678',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita senha curta', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita campos vazios', () => {
    const result = loginSchema.safeParse({ email: '', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  it('valida dados corretos', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345678',
      password_confirmation: '12345678',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita senhas diferentes', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345678',
      password_confirmation: '87654321',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita nome vazio', () => {
    const result = registerSchema.safeParse({
      name: '',
      email: 'john@example.com',
      password: '12345678',
      password_confirmation: '12345678',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita nome com mais de 100 caracteres', () => {
    const result = registerSchema.safeParse({
      name: 'A'.repeat(101),
      email: 'john@example.com',
      password: '12345678',
      password_confirmation: '12345678',
    })
    expect(result.success).toBe(false)
  })
})
