import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sellerService } from '@/services/sellerService'
import type { Seller, PaginationMeta } from '@/types'
import type { CreateSellerInput } from '@/schemas/seller'

export const useSellerStore = defineStore('seller', () => {
  const sellers = ref<Seller[]>([])
  const pagination = ref<PaginationMeta | null>(null)
  const loading = ref(false)

  async function fetchSellers(page = 1, perPage = 15): Promise<void> {
    loading.value = true
    try {
      const response = await sellerService.list({ page, per_page: perPage })
      sellers.value = response.data
      pagination.value = response.meta
    } finally {
      loading.value = false
    }
  }

  async function createSeller(data: CreateSellerInput): Promise<Seller> {
    loading.value = true
    try {
      const seller = await sellerService.create(data)
      await fetchSellers(pagination.value?.current_page ?? 1)
      return seller
    } finally {
      loading.value = false
    }
  }

  async function resendCommission(id: number, date?: string): Promise<string> {
    return sellerService.resendCommission(id, date)
  }

  return { sellers, pagination, loading, fetchSellers, createSeller, resendCommission }
})
