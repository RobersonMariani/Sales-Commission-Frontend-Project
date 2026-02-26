<script setup lang="ts">
import type { PaginationMeta } from '@/types'

interface Props {
  meta: PaginationMeta
}

defineProps<Props>()
const emit = defineEmits<{ 'page-change': [page: number] }>()
</script>

<template>
  <div class="flex items-center justify-between border-t border-gray-100 px-2 pt-4">
    <p class="text-xs text-gray-500">
      Mostrando
      <span class="font-medium text-gray-700">{{ meta.from ?? 0 }}-{{ meta.to ?? 0 }}</span>
      de
      <span class="font-medium text-gray-700">{{ meta.total }}</span>
      resultados
    </p>

    <nav v-if="meta.last_page > 1" class="flex gap-1">
      <button
        :disabled="meta.current_page <= 1"
        class="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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
          class="cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200"
          :class="
            page === meta.current_page
              ? 'border-primary-500 bg-primary-600 text-white shadow-sm'
              : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
          "
          @click="emit('page-change', page)"
        >
          {{ page }}
        </button>
        <span
          v-else-if="page === meta.current_page - 2 || page === meta.current_page + 2"
          class="px-1 py-1.5 text-xs text-gray-300"
        >
          ...
        </span>
      </template>

      <button
        :disabled="meta.current_page >= meta.last_page"
        class="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        @click="emit('page-change', meta.current_page + 1)"
      >
        Próximo
      </button>
    </nav>
  </div>
</template>
