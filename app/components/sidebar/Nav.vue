<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'

// Ignore the props for the example
defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()
const open = defineModel<boolean>('open', { default: true })

async function selectProject() {
  await window.electronAPI.selectFolder()
}

const projects: NavigationMenuItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    active: true,
  },
  {
    label: 'Inbox',
    icon: 'i-lucide-inbox',
    badge: '4',
  },
  {
    label: 'Contacts',
    icon: 'i-lucide-users',
  },
]
</script>

<template>
  <USidebar
    v-model:open="open"
    :variant="variant"
    :collapsible="collapsible"
    :side="side"
    :ui="{
      container: 'h-full',
    }"
  >
    <template #header>
      <UIcon
        name="i-logos-nuxt-icon"
        class="size-8"
      />
    </template>

    <UButton
      label="Add project"
      icon="i-lucide-plus"
      trailing
      color="neutral"
      variant="ghost"
      block
      @click="selectProject"
    />

    <UNavigationMenu
      :items="projects"
      orientation="vertical"
      :ui="{ link: 'p-1.5 overflow-hidden' }"
    />
  </USidebar>
</template>
