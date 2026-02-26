export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  token: string
  token_type: string
  expires_in: number
}

export interface Seller {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface Sale {
  id: number
  seller_id: number
  value: number
  commission: number
  commission_rate: number
  sale_date: string
  created_at: string
  updated_at: string
  seller?: Seller
}

export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface MessageResponse {
  message: string
}

export interface SalesReport {
  total_sales: number
  total_value: number
  total_commission: number
  average_value: number
  average_commission: number
}

export interface SellerSalesReport {
  seller_id: number
  seller_name: string
  seller_email: string
  total_sales: number
  total_value: number
  total_commission: number
}

export interface DailySalesReport {
  date: string
  total_sales: number
  total_value: number
  total_commission: number
}
