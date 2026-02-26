<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  label?: string
  error?: string
  disabled?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  error: '',
  disabled: false,
  placeholder: 'R$ 0,00',
})

const emit = defineEmits<{ blur: [] }>()
const model = defineModel<number>({ default: 0 })

const displayValue = ref(formatToDisplay(model.value))

function formatToDisplay(value: number): string {
  if (!value) return ''
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function parseCurrency(raw: string): number {
  const digits = raw.replace(/\D/g, '')
  return Number(digits) / 100
}

function handleInput(event: Event): void {
  const input = event.target as HTMLInputElement
  const raw = input.value
  const numericValue = parseCurrency(raw)

  model.value = numericValue
  displayValue.value = numericValue > 0 ? formatToDisplay(numericValue) : ''

  const cursorPos = displayValue.value.length
  requestAnimationFrame(() => input.setSelectionRange(cursorPos, cursorPos))
}

function handleFocus(event: Event): void {
  const input = event.target as HTMLInputElement
  requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length))
}

function handleBlur(): void {
  if (model.value > 0) {
    displayValue.value = formatToDisplay(model.value)
  } else {
    displayValue.value = ''
  }
  emit('blur')
}

watch(model, (newVal) => {
  displayValue.value = formatToDisplay(newVal)
})

const hasError = computed(() => !!props.error)
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="mb-1.5 block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="relative">
      <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-medium text-gray-400">
        R$
      </span>
      <input
        :value="displayValue"
        type="text"
        inputmode="numeric"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full rounded-xl border bg-white py-2.5 pl-11 pr-4 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
        :class="
          hasError
            ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
            : 'border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-primary-500/20'
        "
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
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
  </div>
</template>
