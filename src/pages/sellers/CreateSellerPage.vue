<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSellerStore } from '@/stores/seller'
import { useNotificationStore } from '@/stores/notification'
import { createSellerSchema, type CreateSellerInput } from '@/schemas/seller'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCard from '@/components/ui/AppCard.vue'
import type { ZodError } from 'zod/v4'

const router = useRouter()
const sellerStore = useSellerStore()
const notificationStore = useNotificationStore()

const form = ref<CreateSellerInput>({ name: '', email: '' })
const errors = ref<Record<string, string>>({})

function validate(): boolean {
  errors.value = {}
  const result = createSellerSchema.safeParse(form.value)
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
    await sellerStore.createSeller(form.value)
    notificationStore.success('Vendedor cadastrado com sucesso!')
    router.push({ name: 'sellers' })
  } catch {
    notificationStore.error('Erro ao cadastrar vendedor. Verifique os dados.')
  }
}
</script>

<template>
  <div class="mx-auto max-w-xl space-y-6">
    <div class="flex items-center gap-4">
      <RouterLink :to="{ name: 'sellers' }">
        <AppButton variant="secondary" size="sm">Voltar</AppButton>
      </RouterLink>
      <h2 class="text-2xl font-bold text-gray-900">Novo Vendedor</h2>
    </div>

    <AppCard>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <AppInput
          v-model="form.name"
          label="Nome"
          placeholder="Nome do vendedor"
          :error="errors.name"
        />

        <AppInput
          v-model="form.email"
          label="E-mail"
          type="email"
          placeholder="vendedor@email.com"
          :error="errors.email"
        />

        <div class="flex justify-end gap-3">
          <RouterLink :to="{ name: 'sellers' }">
            <AppButton variant="secondary">Cancelar</AppButton>
          </RouterLink>
          <AppButton type="submit" :loading="sellerStore.loading">Cadastrar</AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>
