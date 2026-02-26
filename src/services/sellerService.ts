import api from '@/lib/api'
import type { ApiResponse, PaginatedResponse, Seller } from '@/types'
import type { CreateSellerInput } from '@/schemas/seller'

export interface SellerQueryParams {
  page?: number
  per_page?: number
}

export const sellerService = {
  async list(params?: SellerQueryParams): Promise<PaginatedResponse<Seller>> {
    const response = await api.get<PaginatedResponse<Seller>>('/sellers', { params })
    return response.data
  },

  async get(id: number): Promise<Seller> {
    const response = await api.get<ApiResponse<Seller>>(`/sellers/${id}`)
    return response.data.data
  },

  async create(data: CreateSellerInput): Promise<Seller> {
    const response = await api.post<ApiResponse<Seller>>('/sellers', data)
    return response.data.data
  },

  async resendCommission(id: number, date?: string): Promise<string> {
    const response = await api.post<{ message: string }>(
      `/sellers/${id}/resend-commission`,
      date ? { date } : {},
    )
    return response.data.message
  },
}
