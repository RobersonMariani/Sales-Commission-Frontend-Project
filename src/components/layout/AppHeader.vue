<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout(): Promise<void> {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
    <h1 class="text-lg font-semibold text-gray-900">
      <slot name="title" />
    </h1>

    <div class="flex items-center gap-4">
      <span v-if="authStore.user" class="text-sm text-gray-600">
        {{ authStore.user.name }}
      </span>
      <AppButton variant="secondary" size="sm" @click="handleLogout">
        Sair
      </AppButton>
    </div>
  </header>
</template>
