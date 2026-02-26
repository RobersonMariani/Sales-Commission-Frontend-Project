<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { DailySalesReport } from '@/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps<{
  data: DailySalesReport[]
}>()

const chartData = computed(() => ({
  labels: props.data.map((d) => {
    const [, month, day] = d.date.split('-')
    return `${day}/${month}`
  }),
  datasets: [
    {
      label: 'Valor Total (R$)',
      data: props.data.map((d) => d.total_value),
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: '#4f46e5',
    },
    {
      label: 'Comissão (R$)',
      data: props.data.map((d) => d.total_commission),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: '#10b981',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' as const },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 12 } },
    },
    tooltip: {
      backgroundColor: '#1f2937',
      padding: 12,
      titleFont: { size: 13 },
      bodyFont: { size: 12 },
      callbacks: {
        label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
          const value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ctx.parsed.y ?? 0)
          return ` ${ctx.dataset.label}: ${value}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, color: '#9ca3af' },
    },
    y: {
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
  },
}
</script>

<template>
  <div class="h-72">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
