import api from '@/lib/api'
import type { ApiResponse, SalesReport, SellerSalesReport } from '@/types'

export interface ReportQueryParams {
  start_date?: string
  end_date?: string
  seller_id?: number
}

export const reportService = {
  async getSalesSummary(params?: ReportQueryParams): Promise<SalesReport> {
    const response = await api.get<ApiResponse<SalesReport>>('/reports/sales', { params })
    return response.data.data
  },

  async getSalesBySeller(params?: ReportQueryParams): Promise<SellerSalesReport[]> {
    const response = await api.get<{ data: SellerSalesReport[] }>('/reports/sales/by-seller', { params })
    return response.data.data
  },
}
