<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppLogo from '@/components/ui/AppLogo.vue'

const route = useRoute()

const navItems = [
  { name: 'Dashboard', to: { name: 'dashboard' }, icon: 'dashboard' },
  { name: 'Vendedores', to: { name: 'sellers' }, icon: 'sellers' },
  { name: 'Vendas', to: { name: 'sales' }, icon: 'sales' },
]

function isActive(routeName: string): boolean {
  return route.name === routeName || (route.name as string)?.startsWith(routeName + '.')
}
</script>

<template>
  <aside class="flex h-full w-64 flex-col bg-gray-900">
    <div class="flex h-16 items-center gap-3 px-6">
      <AppLogo size="sm" />
      <div>
        <span class="text-sm font-bold text-white">Sales Commission</span>
        <p class="text-[10px] text-gray-500">Sistema de Comissões</p>
      </div>
    </div>

    <nav class="mt-4 flex-1 space-y-1 px-3">
      <RouterLink
        v-for="item in navItems"
        :key="item.icon"
        :to="item.to"
        class="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
        :class="
          isActive(item.to.name)
            ? 'bg-primary-600/20 text-primary-400'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        "
      >
        <svg v-if="item.icon === 'dashboard'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <svg v-else-if="item.icon === 'sellers'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <svg v-else-if="item.icon === 'sales'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ item.name }}
      </RouterLink>
    </nav>

    <div class="border-t border-white/10 px-3 py-4">
      <p class="px-3 text-[10px] text-gray-600">v1.0.0</p>
    </div>
  </aside>
</template>
