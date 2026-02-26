<script setup lang="ts">
interface Props {
  title?: string
  padding?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  padding: true,
})
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
    <div v-if="title" class="border-b border-gray-100 px-6 py-4">
      <h3 class="text-base font-semibold text-gray-900">{{ title }}</h3>
    </div>
    <div :class="{ 'px-6 py-5': padding }">
      <slot />
    </div>
  </div>
</template>
