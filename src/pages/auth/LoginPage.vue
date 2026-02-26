<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { loginSchema, type LoginInput } from '@/schemas/auth'
import { useFormValidation } from '@/composables/useFormValidation'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { AxiosError } from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = ref<LoginInput>({ email: '', password: '' })
const { errors, validateField, validateAll, setApiErrors } = useFormValidation(loginSchema, form)

async function handleSubmit(): Promise<void> {
  if (!validateAll()) return

  try {
    await authStore.login(form.value)
    router.push({ name: 'dashboard' })
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 422) {
      setApiErrors(err.response.data.errors)
    } else {
      notificationStore.error('E-mail ou senha inválidos.')
    }
  }
}
</script>

<template>
  <div class="flex min-h-screen">
    <div class="hidden w-1/2 lg:flex lg:flex-col lg:justify-center lg:bg-gray-900 lg:px-16">
      <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-2xl shadow-primary-600/40">
        <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2 20h20M5 20V10m5 10V4m5 16v-8m5 8V8" />
        </svg>
      </div>
      <h2 class="mt-6 text-3xl font-bold text-white">Sales Commission</h2>
      <p class="mt-3 max-w-sm text-base text-gray-400">
        Gerencie vendedores, vendas e comissões em um só lugar.
      </p>
    </div>

    <div class="flex w-full items-center justify-center px-6 lg:w-1/2">
      <div class="w-full max-w-sm">
        <div class="mb-8 lg:hidden">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2 20h20M5 20V10m5 10V4m5 16v-8m5 8V8" />
            </svg>
          </div>
        </div>

        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Bem-vindo de volta</h1>
        <p class="mt-2 text-sm text-gray-500">Faça login para acessar o sistema</p>

        <AppCard class="mt-8">
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <AppInput
              v-model="form.email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              :error="errors.email"
              @blur="validateField('email')"
            />

            <AppInput
              v-model="form.password"
              label="Senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              :error="errors.password"
              @blur="validateField('password')"
            />

            <AppButton type="submit" class="w-full" :loading="authStore.loading">
              Entrar
            </AppButton>
          </form>

          <p class="mt-6 text-center text-sm text-gray-500">
            Não tem conta?
            <RouterLink :to="{ name: 'register' }" class="cursor-pointer font-semibold text-primary-600 hover:text-primary-500">
              Criar conta
            </RouterLink>
          </p>
        </AppCard>
      </div>
    </div>
  </div>
</template>
