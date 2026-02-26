import api from '@/lib/api'
import type { ApiResponse, AuthResponse, User } from '@/types'
import type { LoginInput, RegisterInput } from '@/schemas/auth'

export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
    return response.data.data
  },

  async register(data: RegisterInput): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/auth/register', data)
    return response.data.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async me(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    return response.data.data
  },
}
