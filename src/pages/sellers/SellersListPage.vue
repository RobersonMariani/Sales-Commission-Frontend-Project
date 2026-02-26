<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useSellerStore } from '@/stores/seller'
import { useNotificationStore } from '@/stores/notification'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'

const sellerStore = useSellerStore()
const notificationStore = useNotificationStore()

const search = ref('')
const showResendModal = ref(false)
const resendSellerId = ref<number | null>(null)
const resendSellerName = ref('')
const resendDate = ref('')
const resendLoading = ref(false)

const filteredSellers = computed(() => {
  if (!search.value.trim()) return sellerStore.sellers
  const term = search.value.toLowerCase().trim()
  return sellerStore.sellers.filter(
    (s) => s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term),
  )
})

function openResendModal(sellerId: number, sellerName: string): void {
  resendSellerId.value = sellerId
  resendSellerName.value = sellerName
  resendDate.value = new Date().toISOString().split('T')[0] as string
  showResendModal.value = true
}

async function handleResend(): Promise<void> {
  if (!resendSellerId.value) return
  resendLoading.value = true
  try {
    const message = await sellerStore.resendCommission(resendSellerId.value, resendDate.value || undefined)
    notificationStore.success(message)
    showResendModal.value = false
  } catch {
    notificationStore.error('Erro ao reenviar e-mail de comissão.')
  } finally {
    resendLoading.value = false
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

onMounted(() => {
  sellerStore.fetchSellers()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">Vendedores</h2>
        <p class="mt-1 text-sm text-gray-500">Gerencie os vendedores cadastrados</p>
      </div>
      <RouterLink :to="{ name: 'sellers.create' }">
        <AppButton>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Novo Vendedor
        </AppButton>
      </RouterLink>
    </div>

    <div class="relative max-w-sm">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por nome ou e-mail..."
        class="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
      />
      <button
        v-if="search"
        class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-600"
        @click="search = ''"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <AppCard :padding="false">
      <div v-if="sellerStore.loading" class="flex items-center justify-center py-16">
        <div class="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-primary-600" />
      </div>

      <template v-else>
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">ID</th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Nome</th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">E-mail</th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Cadastro</th>
              <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="seller in filteredSellers"
              :key="seller.id"
              class="transition-colors hover:bg-gray-50/50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-400">#{{ seller.id }}</td>
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    {{ seller.name.charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ seller.name }}</span>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ seller.email }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{{ formatDate(seller.created_at) }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <RouterLink :to="{ name: 'sales', query: { seller_id: seller.id } }">
                    <AppButton variant="ghost" size="sm">Vendas</AppButton>
                  </RouterLink>
                  <AppButton variant="ghost" size="sm" @click="openResendModal(seller.id, seller.name)">
                    Reenviar
                  </AppButton>
                </div>
              </td>
            </tr>
            <tr v-if="filteredSellers.length === 0 && sellerStore.sellers.length > 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <p class="text-sm text-gray-500">Nenhum vendedor encontrado para "<span class="font-medium">{{ search }}</span>"</p>
              </td>
            </tr>
            <tr v-if="sellerStore.sellers.length === 0">
              <td colspan="5" class="px-6 py-16 text-center">
                <svg class="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="mt-3 text-sm font-medium text-gray-500">Nenhum vendedor cadastrado</p>
                <p class="mt-1 text-xs text-gray-400">Clique em "Novo Vendedor" para começar.</p>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="sellerStore.pagination" class="px-4 pb-4">
          <AppPagination :meta="sellerStore.pagination" @page-change="sellerStore.fetchSellers($event)" />
        </div>
      </template>
    </AppCard>

    <AppModal :show="showResendModal" title="Reenviar Comissão" @close="showResendModal = false">
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Reenviar e-mail de comissão para <span class="font-semibold text-gray-900">{{ resendSellerName }}</span>.
        </p>
        <AppInput v-model="resendDate" label="Data de referência" type="date" />
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <AppButton variant="secondary" @click="showResendModal = false">Cancelar</AppButton>
          <AppButton :loading="resendLoading" @click="handleResend">Enviar</AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>
