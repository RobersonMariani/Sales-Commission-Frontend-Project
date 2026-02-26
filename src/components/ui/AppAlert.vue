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

const typeClasses: Record<string, string> = {
  success: 'bg-success-50 border-success-500 text-green-800',
  error: 'bg-danger-50 border-danger-500 text-red-800',
  warning: 'bg-warning-50 border-warning-500 text-yellow-800',
  info: 'bg-primary-50 border-primary-500 text-blue-800',
}
</script>

<template>
  <div class="flex items-center justify-between rounded-lg border-l-4 p-4" :class="typeClasses[type]">
    <div class="flex-1">
      <slot />
    </div>
    <button
      v-if="dismissible"
      class="ml-4 text-current opacity-60 transition-opacity hover:opacity-100"
      @click="emit('dismiss')"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
