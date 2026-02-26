<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSellerStore } from '@/stores/seller'
import { useNotificationStore } from '@/stores/notification'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'

const sellerStore = useSellerStore()
const notificationStore = useNotificationStore()

const showResendModal = ref(false)
const resendSellerId = ref<number | null>(null)
const resendDate = ref('')
const resendLoading = ref(false)

function openResendModal(sellerId: number): void {
  resendSellerId.value = sellerId
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
      <h2 class="text-2xl font-bold text-gray-900">Vendedores</h2>
      <RouterLink :to="{ name: 'sellers.create' }">
        <AppButton>Novo Vendedor</AppButton>
      </RouterLink>
    </div>

    <AppCard :padding="false">
      <div v-if="sellerStore.loading" class="flex items-center justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>

      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">E-mail</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cadastro</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="seller in sellerStore.sellers" :key="seller.id" class="hover:bg-gray-50">
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ seller.id }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{{ seller.name }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ seller.email }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ formatDate(seller.created_at) }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-right">
              <RouterLink
                :to="{ name: 'sales', query: { seller_id: seller.id } }"
                class="mr-3 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Vendas
              </RouterLink>
              <button
                class="text-sm font-medium text-warning-600 hover:text-yellow-700"
                @click="openResendModal(seller.id)"
              >
                Reenviar Comissão
              </button>
            </td>
          </tr>
          <tr v-if="sellerStore.sellers.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-sm text-gray-500">
              Nenhum vendedor cadastrado.
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="sellerStore.pagination" class="px-4 pb-4">
        <AppPagination :meta="sellerStore.pagination" @page-change="sellerStore.fetchSellers($event)" />
      </div>
    </AppCard>

    <AppModal :show="showResendModal" title="Reenviar E-mail de Comissão" @close="showResendModal = false">
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Selecione a data para reenviar o e-mail de comissão ao vendedor.
        </p>
        <AppInput v-model="resendDate" label="Data" type="date" />
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
