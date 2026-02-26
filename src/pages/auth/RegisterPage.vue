<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { registerSchema, type RegisterInput } from '@/schemas/auth'
import { useFormValidation } from '@/composables/useFormValidation'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { AxiosError } from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = ref<RegisterInput>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})
const { errors, validateField, validateAll, setApiErrors } = useFormValidation(registerSchema, form)

const passwordStrength = computed(() => {
  const p = form.value.password
  if (!p) return { level: 0, label: '', color: '' }
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++

  const levels: Record<number, { label: string; color: string }> = {
    0: { label: '', color: '' },
    1: { label: 'Fraca', color: 'bg-red-400' },
    2: { label: 'Razoável', color: 'bg-amber-400' },
    3: { label: 'Boa', color: 'bg-emerald-400' },
    4: { label: 'Forte', color: 'bg-emerald-600' },
  }

  return { level: score, ...levels[score] }
})

async function handleSubmit(): Promise<void> {
  if (!validateAll()) return

  try {
    await authStore.register(form.value)
    notificationStore.success('Conta criada com sucesso! Faça login.')
    router.push({ name: 'login' })
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 422) {
      setApiErrors(err.response.data.errors)
    } else {
      notificationStore.error('Erro ao criar conta. Tente novamente.')
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

        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Criar conta</h1>
        <p class="mt-2 text-sm text-gray-500">Preencha os dados para se registrar</p>

        <AppCard class="mt-8">
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <AppInput
              v-model="form.name"
              label="Nome completo"
              placeholder="Seu nome"
              :error="errors.name"
              hint="Até 100 caracteres"
              @blur="validateField('name')"
            />

            <AppInput
              v-model="form.email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              :error="errors.email"
              @blur="validateField('email')"
            />

            <div>
              <AppInput
                v-model="form.password"
                label="Senha"
                type="password"
                placeholder="Mínimo 8 caracteres"
                :error="errors.password"
                @blur="validateField('password')"
              />
              <div v-if="form.password && !errors.password" class="mt-2">
                <div class="flex gap-1">
                  <div
                    v-for="i in 4"
                    :key="i"
                    class="h-1 flex-1 rounded-full transition-all duration-300"
                    :class="i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200'"
                  />
                </div>
                <p class="mt-1 text-[11px] text-gray-400">Força: {{ passwordStrength.label }}</p>
              </div>
            </div>

            <AppInput
              v-model="form.password_confirmation"
              label="Confirmar Senha"
              type="password"
              placeholder="Repita a senha"
              :error="errors.password_confirmation"
              @blur="validateField('password_confirmation')"
            />

            <AppButton type="submit" class="w-full" :loading="authStore.loading">
              Criar Conta
            </AppButton>
          </form>

          <p class="mt-6 text-center text-sm text-gray-500">
            Já tem conta?
            <RouterLink :to="{ name: 'login' }" class="cursor-pointer font-semibold text-primary-600 hover:text-primary-500">
              Fazer login
            </RouterLink>
          </p>
        </AppCard>
      </div>
    </div>
  </div>
</template>
