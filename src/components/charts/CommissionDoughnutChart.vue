<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { SellerSalesReport } from '@/types'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  data: SellerSalesReport[]
}>()

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#3b82f6', '#6b7280']

const chartData = computed(() => {
  const sorted = [...props.data].sort((a, b) => b.total_commission - a.total_commission)
  const top5 = sorted.slice(0, 5)
  const others = sorted.slice(5)
  const othersTotal = others.reduce((sum, s) => sum + s.total_commission, 0)

  const labels = top5.map((s) => s.seller_name)
  const values = top5.map((s) => s.total_commission)

  if (othersTotal > 0) {
    labels.push('Outros')
    values.push(othersTotal)
  }

  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS.slice(0, labels.length),
        hoverOffset: 8,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'right' as const,
      labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } },
    },
    tooltip: {
      backgroundColor: '#1f2937',
      padding: 12,
      titleFont: { size: 13 },
      bodyFont: { size: 12 },
      callbacks: {
        label: (ctx: { label: string; parsed: number; dataset: { data: number[] } }) => {
          const value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ctx.parsed)
          const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0'
          return ` ${ctx.label}: ${value} (${pct}%)`
        },
      },
    },
  },
}
</script>

<template>
  <div class="h-72">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
