<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSaleStore } from '@/stores/sale'
import { useSellerStore } from '@/stores/seller'
import { useNotificationStore } from '@/stores/notification'
import { createSaleSchema, type CreateSaleInput } from '@/schemas/sale'
import { useFormValidation } from '@/composables/useFormValidation'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCurrencyInput from '@/components/ui/AppCurrencyInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppPercentInput from '@/components/ui/AppPercentInput.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { AxiosError } from 'axios'

const router = useRouter()
const saleStore = useSaleStore()
const sellerStore = useSellerStore()
const notificationStore = useNotificationStore()

const form = ref<CreateSaleInput>({
  seller_id: 0,
  value: 0,
  sale_date: new Date().toISOString().split('T')[0] as string,
  commission_rate: 8.5,
})
const { errors, validateField, validateAll, setApiErrors } = useFormValidation(createSaleSchema, form)

const sellerOptions = computed(() =>
  sellerStore.sellers.map((s) => ({ value: s.id, label: s.name })),
)

const estimatedCommission = computed(() => {
  const val = Number(form.value.value) || 0
  const rate = Number(form.value.commission_rate) || 0
  return val * (rate / 100)
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

async function handleSubmit(): Promise<void> {
  if (!validateAll()) return

  try {
    await saleStore.createSale(form.value)
    notificationStore.success('Venda cadastrada com sucesso!')
    router.push({ name: 'sales' })
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 422) {
      setApiErrors(err.response.data.errors)
    } else {
      notificationStore.error('Erro ao cadastrar venda.')
    }
  }
}

onMounted(() => {
  sellerStore.fetchSellers(1, 100)
})
</script>

<template>
  <div class="mx-auto max-w-xl space-y-6">
    <div class="flex items-center gap-4">
      <RouterLink :to="{ name: 'sales' }">
        <AppButton variant="ghost" size="sm">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </AppButton>
      </RouterLink>
      <h2 class="text-xl font-bold text-gray-900">Nova Venda</h2>
    </div>

    <AppCard>
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <AppSelect
          v-model="form.seller_id"
          label="Vendedor"
          :options="sellerOptions"
          placeholder="Selecione o vendedor"
          :error="errors.seller_id"
          @blur="validateField('seller_id')"
        />

        <AppCurrencyInput
          v-model="form.value"
          label="Valor da Venda"
          placeholder="0,00"
          :error="errors.value"
          @blur="validateField('value')"
        />

        <AppPercentInput
          v-model="form.commission_rate"
          label="Taxa de Comissão"
          placeholder="8,50"
          :error="errors.commission_rate"
          @blur="validateField('commission_rate')"
        />

        <AppInput
          v-model="form.sale_date"
          label="Data da Venda"
          type="date"
          :error="errors.sale_date"
          @blur="validateField('sale_date')"
        />

        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div v-if="Number(form.value) > 0" class="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 p-4">
            <svg class="h-5 w-5 shrink-0 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-xs text-primary-600">Comissão estimada ({{ form.commission_rate }}%)</p>
              <p class="text-lg font-bold text-primary-700">{{ formatCurrency(estimatedCommission) }}</p>
            </div>
          </div>
        </Transition>

        <div class="flex justify-end gap-3 pt-2">
          <RouterLink :to="{ name: 'sales' }">
            <AppButton variant="secondary">Cancelar</AppButton>
          </RouterLink>
          <AppButton type="submit" :loading="saleStore.loading">Cadastrar</AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>
