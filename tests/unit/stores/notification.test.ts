import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from '@/stores/notification'

describe('useNotificationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it('começa sem notificações', () => {
    const store = useNotificationStore()
    expect(store.notifications).toHaveLength(0)
  })

  it('adiciona notificação de sucesso', () => {
    const store = useNotificationStore()
    store.success('Operação realizada!')
    expect(store.notifications).toHaveLength(1)

    const notification = store.notifications[0]!
    expect(notification.type).toBe('success')
    expect(notification.message).toBe('Operação realizada!')
  })

  it('adiciona notificação de erro', () => {
    const store = useNotificationStore()
    store.error('Algo deu errado')
    expect(store.notifications).toHaveLength(1)

    const notification = store.notifications[0]!
    expect(notification.type).toBe('error')
  })

  it('remove notificação pelo id', () => {
    const store = useNotificationStore()
    store.success('Test')

    const id = store.notifications[0]!.id
    store.remove(id)
    expect(store.notifications).toHaveLength(0)
  })

  it('auto-remove após duração', () => {
    const store = useNotificationStore()
    store.add('info', 'Auto remove', 3000)
    expect(store.notifications).toHaveLength(1)

    vi.advanceTimersByTime(3000)
    expect(store.notifications).toHaveLength(0)
  })
})
