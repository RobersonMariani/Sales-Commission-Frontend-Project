import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import type { User } from '@/types'
import type { LoginInput, RegisterInput } from '@/schemas/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  async function login(data: LoginInput): Promise<void> {
    loading.value = true
    try {
      const response = await authService.login(data)
      token.value = response.token
      localStorage.setItem('token', response.token)
      await fetchUser()
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterInput): Promise<void> {
    loading.value = true
    try {
      await authService.register(data)
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    }
  }

  async function fetchUser(): Promise<void> {
    if (!token.value) return
    user.value = await authService.me()
  }

  function initialize(): void {
    if (token.value) {
      fetchUser()
    }
  }

  return { user, token, loading, isAuthenticated, login, register, logout, fetchUser, initialize }
})
