<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
})

const variantClasses: Record<string, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 focus-visible:ring-primary-500 shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30',
  secondary:
    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-400 shadow-sm',
  danger:
    'bg-danger-600 text-white hover:bg-red-500 active:bg-red-700 focus-visible:ring-danger-500 shadow-md shadow-danger-600/20',
  success:
    'bg-success-600 text-white hover:bg-green-500 active:bg-green-700 focus-visible:ring-success-500 shadow-md shadow-success-600/20',
  ghost: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-400',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
    :class="[variantClasses[props.variant], sizeClasses[props.size]]"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <slot />
  </button>
</template>
