<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useSellerStore } from '@/stores/seller'
import { useSaleStore } from '@/stores/sale'
import AppCard from '@/components/ui/AppCard.vue'

const sellerStore = useSellerStore()
const saleStore = useSaleStore()

const totalSellers = computed(() => sellerStore.pagination?.total ?? 0)
const totalSales = computed(() => saleStore.pagination?.total ?? 0)
const totalValue = computed(() =>
  saleStore.sales.reduce((sum, sale) => sum + sale.value, 0),
)
const totalCommission = computed(() =>
  saleStore.sales.reduce((sum, sale) => sum + sale.commission, 0),
)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

onMounted(async () => {
  await Promise.all([
    sellerStore.fetchSellers(1, 1),
    saleStore.fetchSales(1, 100),
  ])
})
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <AppCard>
        <div class="text-center">
          <p class="text-sm font-medium text-gray-500">Vendedores</p>
          <p class="mt-1 text-3xl font-bold text-gray-900">{{ totalSellers }}</p>
        </div>
      </AppCard>

      <AppCard>
        <div class="text-center">
          <p class="text-sm font-medium text-gray-500">Total de Vendas</p>
          <p class="mt-1 text-3xl font-bold text-gray-900">{{ totalSales }}</p>
        </div>
      </AppCard>

      <AppCard>
        <div class="text-center">
          <p class="text-sm font-medium text-gray-500">Valor Total</p>
          <p class="mt-1 text-3xl font-bold text-primary-600">{{ formatCurrency(totalValue) }}</p>
        </div>
      </AppCard>

      <AppCard>
        <div class="text-center">
          <p class="text-sm font-medium text-gray-500">Comissões</p>
          <p class="mt-1 text-3xl font-bold text-success-600">{{ formatCurrency(totalCommission) }}</p>
        </div>
      </AppCard>
    </div>
  </div>
</template>
