<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useReportStore } from '@/stores/report'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'

const reportStore = useReportStore()
const localStartDate = ref('')
const localEndDate = ref('')

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const cards = computed(() => {
  const s = reportStore.summary
  if (!s) return []
  return [
    {
      label: 'Total de Vendas',
      value: s.total_sales,
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      bg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-gray-900',
    },
    {
      label: 'Valor Total',
      value: formatCurrency(s.total_value),
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      bg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      valueColor: 'text-primary-700',
    },
    {
      label: 'Comissão Total',
      value: formatCurrency(s.total_commission),
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      bg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-700',
    },
    {
      label: 'Ticket Médio',
      value: formatCurrency(s.average_value),
      icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z',
      bg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      valueColor: 'text-amber-700',
    },
    {
      label: 'Comissão Média',
      value: formatCurrency(s.average_commission),
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      bg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      valueColor: 'text-violet-700',
    },
  ]
})

async function applyFilters(): Promise<void> {
  reportStore.setFilters(localStartDate.value || undefined, localEndDate.value || undefined)
  await reportStore.fetchAll()
}

async function clearFilters(): Promise<void> {
  localStartDate.value = ''
  localEndDate.value = ''
  reportStore.clearFilters()
  await reportStore.fetchAll()
}

onMounted(() => reportStore.fetchAll())
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight text-gray-900">Relatórios</h2>
      <p class="mt-1 text-sm text-gray-500">Resumo geral de vendas e ranking por vendedor</p>
    </div>

    <AppCard>
      <div class="flex flex-wrap items-end gap-4">
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-500">Data Início</label>
          <input
            v-model="localStartDate"
            type="date"
            class="cursor-pointer rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-700 shadow-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-500">Data Fim</label>
          <input
            v-model="localEndDate"
            type="date"
            class="cursor-pointer rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-700 shadow-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
        </div>
        <AppButton @click="applyFilters">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtrar
        </AppButton>
        <AppButton v-if="localStartDate || localEndDate" variant="ghost" @click="clearFilters">
          Limpar
        </AppButton>
      </div>
    </AppCard>

    <div v-if="reportStore.loading" class="flex items-center justify-center py-16">
      <div class="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-primary-600" />
    </div>

    <template v-else-if="reportStore.summary">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
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
              <p class="mt-0.5 text-xl font-bold" :class="card.valueColor">{{ card.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <AppCard title="Ranking por Vendedor" :padding="false">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">#</th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Vendedor</th>
              <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Vendas</th>
              <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Valor Total</th>
              <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Comissão Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="(seller, idx) in reportStore.sellerReports"
              :key="seller.seller_id"
              class="transition-colors hover:bg-gray-50/50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-400">{{ idx + 1 }}</td>
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    {{ seller.seller_name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-900">{{ seller.seller_name }}</span>
                    <p class="text-xs text-gray-400">{{ seller.seller_email }}</p>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                {{ seller.total_sales }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                {{ formatCurrency(seller.total_value) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <span class="inline-flex rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {{ formatCurrency(seller.total_commission) }}
                </span>
              </td>
            </tr>
            <tr v-if="reportStore.sellerReports.length === 0">
              <td colspan="5" class="px-6 py-16 text-center">
                <svg class="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p class="mt-3 text-sm font-medium text-gray-500">Nenhum dado encontrado</p>
                <p class="mt-1 text-xs text-gray-400">Ajuste os filtros ou cadastre vendas.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </AppCard>
    </template>
  </div>
</template>
