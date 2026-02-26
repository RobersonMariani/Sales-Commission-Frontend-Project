import api from '@/lib/api'
import type { ApiResponse, PaginatedResponse, Sale } from '@/types'
import type { CreateSaleInput } from '@/schemas/sale'

export interface SaleQueryParams {
  seller_id?: number
  page?: number
  per_page?: number
}

export const saleService = {
  async list(params?: SaleQueryParams): Promise<PaginatedResponse<Sale>> {
    const response = await api.get<PaginatedResponse<Sale>>('/sales', { params })
    return response.data
  },

  async get(id: number): Promise<Sale> {
    const response = await api.get<ApiResponse<Sale>>(`/sales/${id}`)
    return response.data.data
  },

  async create(data: CreateSaleInput): Promise<Sale> {
    const response = await api.post<ApiResponse<Sale>>('/sales', data)
    return response.data.data
  },
}
