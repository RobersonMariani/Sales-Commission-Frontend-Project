<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  error?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  error: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  hint: '',
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
      <input
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
        :class="
          hasError
            ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
            : 'border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-primary-500/20'
        "
        @blur="emit('blur')"
      />
      <div v-if="hasError" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg class="h-4 w-4 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
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
    <p v-if="hint && !hasError" class="mt-1.5 text-xs text-gray-400">{{ hint }}</p>
  </div>
</template>
