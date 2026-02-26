<script setup lang="ts">
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

withDefaults(defineProps<Props>(), {
  label: '',
  error: '',
  placeholder: 'Selecione...',
  disabled: false,
})

const model = defineModel<string | number>()
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="mb-1 block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <select
      v-model="model"
      :disabled="disabled"
      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
      :class="{ 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20': error }"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-danger-600">{{ error }}</p>
  </div>
</template>
