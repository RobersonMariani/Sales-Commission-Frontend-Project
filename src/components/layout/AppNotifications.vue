<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'
import AppAlert from '@/components/ui/AppAlert.vue'

const notificationStore = useNotificationStore()
</script>

<template>
  <div class="fixed right-4 top-4 z-50 flex w-96 flex-col gap-2">
    <TransitionGroup name="notification">
      <AppAlert
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        :type="notification.type"
        dismissible
        @dismiss="notificationStore.remove(notification.id)"
      >
        {{ notification.message }}
      </AppAlert>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
