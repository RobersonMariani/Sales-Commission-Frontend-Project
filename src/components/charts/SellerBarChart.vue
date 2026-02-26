<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import type { SellerSalesReport } from '@/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  data: SellerSalesReport[]
}>()

const top10 = computed(() => props.data.slice(0, 10))

const chartData = computed(() => ({
  labels: top10.value.map((s) => s.seller_name),
  datasets: [
    {
      label: 'Valor Total (R$)',
      data: top10.value.map((s) => s.total_value),
      backgroundColor: 'rgba(79, 70, 229, 0.8)',
      hoverBackgroundColor: '#4f46e5',
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1f2937',
      padding: 12,
      titleFont: { size: 13 },
      bodyFont: { size: 12 },
      callbacks: {
        label: (ctx: { parsed: { x: number | null } }) => {
          const value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ctx.parsed.x ?? 0)
          return ` ${value}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(0,0,0,0.04)' },
      ticks: {
        font: { size: 11 },
        color: '#9ca3af',
        callback: (value: string | number) =>
          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(
            Number(value),
          ),
      },
    },
    y: {
      grid: { display: false },
      ticks: { font: { size: 12 }, color: '#374151' },
    },
  },
}
</script>

<template>
  <div class="h-72">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
