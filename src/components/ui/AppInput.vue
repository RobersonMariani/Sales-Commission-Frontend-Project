<script setup lang="ts">
interface Props {
  label?: string
  error?: string
  type?: string
  placeholder?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  label: '',
  error: '',
  type: 'text',
  placeholder: '',
  disabled: false,
})

const model = defineModel<string | number>()
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="mb-1 block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
      :class="{ 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20': error }"
    />
    <p v-if="error" class="mt-1 text-sm text-danger-600">{{ error }}</p>
  </div>
</template>
