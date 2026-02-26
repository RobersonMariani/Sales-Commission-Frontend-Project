import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saleService } from '@/services/saleService'
import type { Sale, PaginationMeta } from '@/types'
import type { CreateSaleInput } from '@/schemas/sale'

export const useSaleStore = defineStore('sale', () => {
  const sales = ref<Sale[]>([])
  const pagination = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const filterSellerId = ref<number | undefined>(undefined)

  async function fetchSales(page = 1, perPage = 15): Promise<void> {
    loading.value = true
    try {
      const response = await saleService.list({
        page,
        per_page: perPage,
        seller_id: filterSellerId.value,
      })
      sales.value = response.data
      pagination.value = response.meta
    } finally {
      loading.value = false
    }
  }

  async function createSale(data: CreateSaleInput): Promise<Sale> {
    loading.value = true
    try {
      const sale = await saleService.create(data)
      await fetchSales(pagination.value?.current_page ?? 1)
      return sale
    } finally {
      loading.value = false
    }
  }

  function setFilterSeller(sellerId: number | undefined): void {
    filterSellerId.value = sellerId
  }

  return { sales, pagination, loading, filterSellerId, fetchSales, createSale, setFilterSeller }
})
