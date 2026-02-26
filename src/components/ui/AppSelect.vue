<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: string | number
  label: string
}

interface Props {
  label?: string
  error?: string
  options: Option[]
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  error: '',
  placeholder: 'Selecione...',
  disabled: false,
})

const emit = defineEmits<{ blur: [] }>()
const model = defineModel<string | number>()

const hasError = computed(() => !!props.error)
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="mb-1.5 block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="relative">
      <select
        v-model="model"
        :disabled="disabled"
        class="w-full cursor-pointer appearance-none rounded-xl border bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 shadow-sm transition-all duration-200 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
        :class="
          hasError
            ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
            : 'border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-primary-500/20'
        "
        @blur="emit('blur')"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <p v-if="hasError" class="mt-1.5 text-xs font-medium text-danger-600">{{ error }}</p>
    </Transition>
  </div>
</template>
