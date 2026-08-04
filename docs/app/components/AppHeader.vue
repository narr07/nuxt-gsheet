<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute()
const router = useRouter()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { header } = useAppConfig()

const currentLang = computed(() => {
  return route.path.startsWith('/id') ? 'id' : 'en'
})

const homeLink = computed(() => {
  return currentLang.value === 'id' ? '/id' : '/'
})

const toggleLanguage = () => {
  let targetPath = route.path
  if (currentLang.value === 'id') {
    targetPath = route.path.replace(/^\/id/, '')
    if (!targetPath) targetPath = '/'
  } else {
    targetPath = '/id' + (route.path === '/' ? '' : route.path)
  }
  router.push(targetPath)
}
</script>

<template>
  <UHeader
    :ui="{ center: 'flex-1' }"
    :to="homeLink"
  >
    <UContentSearchButton
      v-if="header?.search"
      :collapsed="false"
      class="w-full"
    />

    <template
      v-if="header?.logo?.dark || header?.logo?.light || header?.title"
      #title
    >
      <UColorModeImage
        v-if="header?.logo?.dark || header?.logo?.light"
        :light="header?.logo?.light!"
        :dark="header?.logo?.dark!"
        :alt="header?.logo?.alt"
        class="h-6 w-auto shrink-0"
      />

      <span v-else-if="header?.title">
        {{ header.title }}
      </span>
    </template>

    <template
      v-else
      #left
    >
      <NuxtLink :to="homeLink">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>

      <TemplateMenu />
    </template>

    <template #right>
      <UContentSearchButton
        v-if="header?.search"
        class="lg:hidden"
      />

      <!-- Path-retaining bilingual toggle -->
      <UButton
        :label="currentLang === 'id' ? 'EN' : 'ID'"
        variant="ghost"
        color="neutral"
        class="font-bold font-mono"
        @click="toggleLanguage"
      />

      <UColorModeButton v-if="header?.colorMode" />

      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #body>
      <UContentNavigation
        highlight
        :navigation="navigation"
      />
    </template>
  </UHeader>
</template>
