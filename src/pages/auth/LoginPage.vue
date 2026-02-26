<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { loginSchema, type LoginInput } from '@/schemas/auth'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCard from '@/components/ui/AppCard.vue'
import type { ZodError } from 'zod/v4'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = ref<LoginInput>({ email: '', password: '' })
const errors = ref<Record<string, string>>({})

function validate(): boolean {
  errors.value = {}
  const result = loginSchema.safeParse(form.value)
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
    await authStore.login(form.value)
    router.push({ name: 'dashboard' })
  } catch {
    notificationStore.error('E-mail ou senha inválidos.')
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
        <h1 class="text-2xl font-bold text-gray-900">Sales Commission</h1>
        <p class="mt-1 text-sm text-gray-500">Faça login para acessar o sistema</p>
      </div>

      <AppCard>
        <form @submit.prevent="handleSubmit" class="space-y-4">
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

          <AppButton type="submit" class="w-full" :loading="authStore.loading">
            Entrar
          </AppButton>
        </form>

        <p class="mt-4 text-center text-sm text-gray-500">
          Não tem conta?
          <RouterLink :to="{ name: 'register' }" class="font-medium text-primary-600 hover:text-primary-700">
            Criar conta
          </RouterLink>
        </p>
      </AppCard>
    </div>
  </div>
</template>
