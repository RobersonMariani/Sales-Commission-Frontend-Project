<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSaleStore } from '@/stores/sale'
import { useSellerStore } from '@/stores/seller'
import { useNotificationStore } from '@/stores/notification'
import { createSaleSchema, type CreateSaleInput } from '@/schemas/sale'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppCard from '@/components/ui/AppCard.vue'
import type { ZodError } from 'zod/v4'

const router = useRouter()
const saleStore = useSaleStore()
const sellerStore = useSellerStore()
const notificationStore = useNotificationStore()

const form = ref<CreateSaleInput>({
  seller_id: 0,
  value: 0,
  sale_date: new Date().toISOString().split('T')[0] as string,
})
const errors = ref<Record<string, string>>({})

const sellerOptions = computed(() =>
  sellerStore.sellers.map((s) => ({ value: s.id, label: s.name })),
)

const estimatedCommission = computed(() => {
  const val = Number(form.value.value) || 0
  return val * 0.085
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function validate(): boolean {
  errors.value = {}
  const result = createSaleSchema.safeParse(form.value)
  if (!result.success) {
    for (const issue of (result.error as ZodError).issues) {
      const field = issue.path[0]
      if (field && !errors.value[String(field)]) {
        errors.value[String(field)] = issue.message
      }
    }
    return false
  }
  return true
}

async function handleSubmit(): Promise<void> {
  if (!validate()) return

  try {
    await saleStore.createSale(form.value)
    notificationStore.success('Venda cadastrada com sucesso!')
    router.push({ name: 'sales' })
  } catch {
    notificationStore.error('Erro ao cadastrar venda. Verifique os dados.')
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
        <AppButton variant="secondary" size="sm">Voltar</AppButton>
      </RouterLink>
      <h2 class="text-2xl font-bold text-gray-900">Nova Venda</h2>
    </div>

    <AppCard>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <AppSelect
          v-model="form.seller_id"
          label="Vendedor"
          :options="sellerOptions"
          placeholder="Selecione o vendedor"
          :error="errors.seller_id"
        />

        <AppInput
          v-model="form.value"
          label="Valor da Venda (R$)"
          type="number"
          placeholder="0,00"
          :error="errors.value"
        />

        <AppInput
          v-model="form.sale_date"
          label="Data da Venda"
          type="date"
          :error="errors.sale_date"
        />

        <div v-if="form.value > 0" class="rounded-lg bg-primary-50 p-4">
          <p class="text-sm text-gray-600">
            Comissão estimada (8.5%):
            <span class="font-semibold text-primary-700">{{ formatCurrency(estimatedCommission) }}</span>
          </p>
        </div>

        <div class="flex justify-end gap-3">
          <RouterLink :to="{ name: 'sales' }">
            <AppButton variant="secondary">Cancelar</AppButton>
          </RouterLink>
          <AppButton type="submit" :loading="saleStore.loading">Cadastrar</AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>
