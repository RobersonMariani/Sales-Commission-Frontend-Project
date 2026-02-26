<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSaleStore } from '@/stores/sale'
import { useSellerStore } from '@/stores/seller'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import { computed } from 'vue'

const route = useRoute()
const saleStore = useSaleStore()
const sellerStore = useSellerStore()

const sellerOptions = computed(() =>
  sellerStore.sellers.map((s) => ({ value: s.id, label: s.name })),
)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR')
}

watch(
  () => saleStore.filterSellerId,
  () => saleStore.fetchSales(1),
)

onMounted(async () => {
  await sellerStore.fetchSellers(1, 100)

  const querySellerID = route.query.seller_id
  if (querySellerID) {
    saleStore.setFilterSeller(Number(querySellerID))
  }

  await saleStore.fetchSales()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Vendas</h2>
      <RouterLink :to="{ name: 'sales.create' }">
        <AppButton>Nova Venda</AppButton>
      </RouterLink>
    </div>

    <div class="max-w-xs">
      <AppSelect
        v-model="saleStore.filterSellerId"
        label="Filtrar por Vendedor"
        :options="sellerOptions"
        placeholder="Todos os vendedores"
      />
      <button
        v-if="saleStore.filterSellerId"
        class="mt-1 text-xs text-primary-600 hover:text-primary-700"
        @click="saleStore.setFilterSeller(undefined)"
      >
        Limpar filtro
      </button>
    </div>

    <AppCard :padding="false">
      <div v-if="saleStore.loading" class="flex items-center justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>

      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Vendedor</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Data</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Valor</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Comissão (8.5%)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="sale in saleStore.sales" :key="sale.id" class="hover:bg-gray-50">
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ sale.id }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
              {{ sale.seller?.name ?? '-' }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ formatDate(sale.sale_date) }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">{{ formatCurrency(sale.value) }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-success-600">
              {{ formatCurrency(sale.commission) }}
            </td>
          </tr>
          <tr v-if="saleStore.sales.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-sm text-gray-500">
              Nenhuma venda encontrada.
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="saleStore.pagination" class="px-4 pb-4">
        <AppPagination :meta="saleStore.pagination" @page-change="saleStore.fetchSales($event)" />
      </div>
    </AppCard>
  </div>
</template>
