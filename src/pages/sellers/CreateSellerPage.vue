<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSellerStore } from '@/stores/seller'
import { useNotificationStore } from '@/stores/notification'
import { createSellerSchema, type CreateSellerInput } from '@/schemas/seller'
import { useFormValidation } from '@/composables/useFormValidation'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { AxiosError } from 'axios'

const router = useRouter()
const sellerStore = useSellerStore()
const notificationStore = useNotificationStore()

const form = ref<CreateSellerInput>({ name: '', email: '' })
const { errors, validateField, validateAll, setApiErrors } = useFormValidation(createSellerSchema, form)

async function handleSubmit(): Promise<void> {
  if (!validateAll()) return

  try {
    await sellerStore.createSeller(form.value)
    notificationStore.success('Vendedor cadastrado com sucesso!')
    router.push({ name: 'sellers' })
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 422) {
      setApiErrors(err.response.data.errors)
    } else {
      notificationStore.error('Erro ao cadastrar vendedor.')
    }
  }
}
</script>

<template>
  <div class="mx-auto max-w-xl space-y-6">
    <div class="flex items-center gap-4">
      <RouterLink :to="{ name: 'sellers' }">
        <AppButton variant="ghost" size="sm">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </AppButton>
      </RouterLink>
      <h2 class="text-xl font-bold text-gray-900">Novo Vendedor</h2>
    </div>

    <AppCard>
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <AppInput
          v-model="form.name"
          label="Nome"
          placeholder="Nome do vendedor"
          hint="Até 100 caracteres"
          :error="errors.name"
          @blur="validateField('name')"
        />

        <AppInput
          v-model="form.email"
          label="E-mail"
          type="email"
          placeholder="vendedor@email.com"
          :error="errors.email"
          @blur="validateField('email')"
        />

        <div class="flex justify-end gap-3 pt-2">
          <RouterLink :to="{ name: 'sellers' }">
            <AppButton variant="secondary">Cancelar</AppButton>
          </RouterLink>
          <AppButton type="submit" :loading="sellerStore.loading">Cadastrar</AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>
