<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSaleStore } from '@/stores/sale'
import { useSellerStore } from '@/stores/seller'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppPagination from '@/components/ui/AppPagination.vue'

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
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">Vendas</h2>
        <p class="mt-1 text-sm text-gray-500">Acompanhe todas as vendas e comissões</p>
      </div>
      <RouterLink :to="{ name: 'sales.create' }">
        <AppButton>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nova Venda
        </AppButton>
      </RouterLink>
    </div>

    <div class="flex items-end gap-3">
      <div class="w-64">
        <AppSelect
          v-model="saleStore.filterSellerId"
          label="Filtrar por Vendedor"
          :options="sellerOptions"
          placeholder="Todos os vendedores"
        />
      </div>
      <AppButton
        v-if="saleStore.filterSellerId"
        variant="ghost"
        size="sm"
        @click="saleStore.setFilterSeller(undefined)"
      >
        Limpar
      </AppButton>
    </div>

    <AppCard :padding="false">
      <div v-if="saleStore.loading" class="flex items-center justify-center py-16">
        <div class="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-primary-600" />
      </div>

      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">ID</th>
            <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Vendedor</th>
            <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Data</th>
            <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Valor</th>
            <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Comissão</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="sale in saleStore.sales"
            :key="sale.id"
            class="transition-colors hover:bg-gray-50/50"
          >
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-400">#{{ sale.id }}</td>
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                  {{ (sale.seller?.name ?? '?').charAt(0).toUpperCase() }}
                </div>
                <span class="text-sm font-medium text-gray-900">{{ sale.seller?.name ?? '-' }}</span>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ formatDate(sale.sale_date) }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
              {{ formatCurrency(sale.value) }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-right">
              <span class="inline-flex rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {{ formatCurrency(sale.commission) }}
              </span>
            </td>
          </tr>
          <tr v-if="saleStore.sales.length === 0">
            <td colspan="5" class="px-6 py-16 text-center">
              <svg class="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="mt-3 text-sm font-medium text-gray-500">Nenhuma venda encontrada</p>
              <p class="mt-1 text-xs text-gray-400">Clique em "Nova Venda" para cadastrar.</p>
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
