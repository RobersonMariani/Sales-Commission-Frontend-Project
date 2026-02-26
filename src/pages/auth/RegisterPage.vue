<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { registerSchema, type RegisterInput } from '@/schemas/auth'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCard from '@/components/ui/AppCard.vue'
import type { ZodError } from 'zod/v4'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = ref<RegisterInput>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})
const errors = ref<Record<string, string>>({})

function validate(): boolean {
  errors.value = {}
  const result = registerSchema.safeParse(form.value)
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
    await authStore.register(form.value)
    notificationStore.success('Conta criada com sucesso! Faça login.')
    router.push({ name: 'login' })
  } catch {
    notificationStore.error('Erro ao criar conta. Verifique os dados.')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-lg font-bold text-white">
          SC
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Criar Conta</h1>
        <p class="mt-1 text-sm text-gray-500">Preencha os dados para se registrar</p>
      </div>

      <AppCard>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <AppInput
            v-model="form.name"
            label="Nome"
            placeholder="Seu nome completo"
            :error="errors.name"
          />

          <AppInput
            v-model="form.email"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            :error="errors.email"
          />

          <AppInput
            v-model="form.password"
            label="Senha"
            type="password"
            placeholder="••••••••"
            :error="errors.password"
          />

          <AppInput
            v-model="form.password_confirmation"
            label="Confirmar Senha"
            type="password"
            placeholder="••••••••"
            :error="errors.password_confirmation"
          />

          <AppButton type="submit" class="w-full" :loading="authStore.loading">
            Criar Conta
          </AppButton>
        </form>

        <p class="mt-4 text-center text-sm text-gray-500">
          Já tem conta?
          <RouterLink :to="{ name: 'login' }" class="font-medium text-primary-600 hover:text-primary-700">
            Fazer login
          </RouterLink>
        </p>
      </AppCard>
    </div>
  </div>
</template>
