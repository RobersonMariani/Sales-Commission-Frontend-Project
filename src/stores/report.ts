import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reportService } from '@/services/reportService'
import type { SalesReport, SellerSalesReport } from '@/types'

export const useReportStore = defineStore('report', () => {
  const summary = ref<SalesReport | null>(null)
  const sellerReports = ref<SellerSalesReport[]>([])
  const loading = ref(false)
  const startDate = ref<string | undefined>(undefined)
  const endDate = ref<string | undefined>(undefined)

  async function fetchSummary(): Promise<void> {
    const data = await reportService.getSalesSummary({
      start_date: startDate.value,
      end_date: endDate.value,
    })
    summary.value = data
  }

  async function fetchBySeller(): Promise<void> {
    const data = await reportService.getSalesBySeller({
      start_date: startDate.value,
      end_date: endDate.value,
    })
    sellerReports.value = data
  }

  async function fetchAll(): Promise<void> {
    loading.value = true
    try {
      await Promise.all([fetchSummary(), fetchBySeller()])
    } finally {
      loading.value = false
    }
  }

  function setFilters(start: string | undefined, end: string | undefined): void {
    startDate.value = start
    endDate.value = end
  }

  function clearFilters(): void {
    startDate.value = undefined
    endDate.value = undefined
  }

  return { summary, sellerReports, loading, startDate, endDate, fetchSummary, fetchBySeller, fetchAll, setFilters, clearFilters }
})
