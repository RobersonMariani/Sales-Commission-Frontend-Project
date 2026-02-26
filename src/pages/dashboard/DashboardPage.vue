<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useSellerStore } from '@/stores/seller'
import { reportService } from '@/services/reportService'
import type { DailySalesReport, SalesReport, SellerSalesReport } from '@/types'
import AppCard from '@/components/ui/AppCard.vue'
import SalesLineChart from '@/components/charts/SalesLineChart.vue'
import SellerBarChart from '@/components/charts/SellerBarChart.vue'
import CommissionDoughnutChart from '@/components/charts/CommissionDoughnutChart.vue'

const sellerStore = useSellerStore()
const summary = ref<SalesReport | null>(null)
const dailySales = ref<DailySalesReport[]>([])
const sellerReports = ref<SellerSalesReport[]>([])
const loading = ref(true)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const totalSellers = computed(() => sellerStore.pagination?.total ?? 0)

const cards = computed(() => {
  const s = summary.value
  return [
    {
      label: 'Vendedores',
      value: totalSellers.value,
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      color: 'text-gray-900',
      bg: 'bg-gray-100',
      iconColor: 'text-gray-600',
    },
    {
      label: 'Total de Vendas',
      value: s?.total_sales ?? 0,
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      color: 'text-gray-900',
      bg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Valor Total',
      value: formatCurrency(s?.total_value ?? 0),
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-primary-700',
      bg: 'bg-primary-100',
      iconColor: 'text-primary-600',
    },
    {
      label: 'Comissões',
      value: formatCurrency(s?.total_commission ?? 0),
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-emerald-700',
      bg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
  ]
})

onMounted(async () => {
  loading.value = true
  const [, summaryData, daily, sellers] = await Promise.all([
    sellerStore.fetchSellers(1, 1),
    reportService.getSalesSummary(),
    reportService.getDailySales(),
    reportService.getSalesBySeller(),
  ])
  summary.value = summaryData
  dailySales.value = daily
  sellerReports.value = sellers
  loading.value = false
})
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
      <p class="mt-1 text-sm text-gray-500">Visão geral do sistema de comissões</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-primary-600" />
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="card in cards"
          :key="card.label"
          class="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center gap-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" :class="card.bg">
              <svg class="h-5 w-5" :class="card.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="card.icon" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500">{{ card.label }}</p>
              <p class="mt-0.5 text-xl font-bold" :class="card.color">{{ card.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <AppCard v-if="dailySales.length > 0" title="Vendas Diárias — Últimos 30 dias">
        <SalesLineChart :data="dailySales" />
      </AppCard>

      <div v-if="sellerReports.length > 0" class="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <AppCard title="Top Vendedores por Valor" class="lg:col-span-3">
          <SellerBarChart :data="sellerReports" />
        </AppCard>
        <AppCard title="Distribuição de Comissões" class="lg:col-span-2">
          <CommissionDoughnutChart :data="sellerReports" />
        </AppCard>
      </div>
    </template>
  </div>
</template>
