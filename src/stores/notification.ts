import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

let nextId = 0

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  function add(type: Notification['type'], message: string, duration = 5000): void {
    const id = nextId++
    notifications.value.push({ id, type, message })

    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }

  function remove(id: number): void {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  function success(message: string): void {
    add('success', message)
  }

  function error(message: string): void {
    add('error', message)
  }

  return { notifications, add, remove, success, error }
})
