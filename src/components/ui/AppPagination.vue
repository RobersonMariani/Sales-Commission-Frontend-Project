<script setup lang="ts">
import type { PaginationMeta } from '@/types'

interface Props {
  meta: PaginationMeta
}

defineProps<Props>()
const emit = defineEmits<{ 'page-change': [page: number] }>()
</script>

<template>
  <div v-if="meta.last_page > 1" class="flex items-center justify-between border-t border-gray-200 px-2 pt-4">
    <p class="text-sm text-gray-600">
      Mostrando <span class="font-medium">{{ meta.from }}</span> a
      <span class="font-medium">{{ meta.to }}</span> de
      <span class="font-medium">{{ meta.total }}</span> resultados
    </p>

    <nav class="flex gap-1">
      <button
        :disabled="meta.current_page <= 1"
        class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        @click="emit('page-change', meta.current_page - 1)"
      >
        Anterior
      </button>

      <template v-for="page in meta.last_page" :key="page">
        <button
          v-if="
            page === 1 ||
            page === meta.last_page ||
            (page >= meta.current_page - 1 && page <= meta.current_page + 1)
          "
          class="rounded-lg border px-3 py-1.5 text-sm transition-colors"
          :class="
            page === meta.current_page
              ? 'border-primary-500 bg-primary-50 font-medium text-primary-700'
              : 'border-gray-300 hover:bg-gray-50'
          "
          @click="emit('page-change', page)"
        >
          {{ page }}
        </button>
        <span
          v-else-if="page === meta.current_page - 2 || page === meta.current_page + 2"
          class="px-1 py-1.5 text-sm text-gray-400"
        >
          ...
        </span>
      </template>

      <button
        :disabled="meta.current_page >= meta.last_page"
        class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        @click="emit('page-change', meta.current_page + 1)"
      >
        Próximo
      </button>
    </nav>
  </div>
</template>
