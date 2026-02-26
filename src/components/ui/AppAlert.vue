<script setup lang="ts">
interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  dismissible?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: false,
})

const emit = defineEmits<{ dismiss: [] }>()

const config: Record<string, { bg: string; icon: string }> = {
  success: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  error: { bg: 'bg-red-50 border-red-200 text-red-800', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
  warning: { bg: 'bg-amber-50 border-amber-200 text-amber-800', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' },
  info: { bg: 'bg-blue-50 border-blue-200 text-blue-800', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
}
</script>

<template>
  <div class="flex items-start gap-3 rounded-xl border p-4 shadow-sm" :class="config[type].bg">
    <svg class="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="config[type].icon" />
    </svg>
    <div class="flex-1 text-sm font-medium">
      <slot />
    </div>
    <button
      v-if="dismissible"
      class="cursor-pointer rounded-lg p-0.5 text-current opacity-50 transition-opacity hover:opacity-100"
      @click="emit('dismiss')"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
