<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClasses = {
  sm: { wrapper: 'h-9 w-9 rounded-xl shadow-lg shadow-primary-600/30', icon: 'h-5 w-5' },
  md: { wrapper: 'h-12 w-12 rounded-2xl shadow-lg', icon: 'h-6 w-6' },
  lg: { wrapper: 'h-14 w-14 rounded-2xl shadow-2xl shadow-primary-600/40', icon: 'h-7 w-7' },
}
</script>

<template>
  <div
    class="flex items-center justify-center bg-primary-600 text-white"
    :class="sizeClasses[size].wrapper"
  >
    <svg :class="sizeClasses[size].icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2 20h20M5 20V10m5 10V4m5 16v-8m5 8V8" />
    </svg>
  </div>
</template>
