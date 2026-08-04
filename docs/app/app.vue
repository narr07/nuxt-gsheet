<script setup lang="ts">
const route = useRoute()
const { seo } = useAppConfig()

// Fetch navigation trees for both languages
const { data: navigationEn } = await useAsyncData('navigation-en', () => queryCollectionNavigation('docs_en'))
const { data: navigationId } = await useAsyncData('navigation-id', () => queryCollectionNavigation('docs_id'))

// Fetch search files for both languages
const { data: filesEn } = useLazyAsyncData('search-en', () => queryCollectionSearchSections('docs_en'), {
  server: false
})
const { data: filesId } = useLazyAsyncData('search-id', () => queryCollectionSearchSections('docs_id'), {
  server: false
})

const currentLang = computed(() => {
  return route.path.startsWith('/id') ? 'id' : 'en'
})

const currentNavigation = computed(() => {
  const isId = route.path.startsWith('/id')
  return isId ? (navigationId.value || []) : (navigationEn.value || [])
})

const files = computed(() => {
  const isId = route.path.startsWith('/id')
  return isId ? (filesId.value || []) : (filesEn.value || [])
})

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: currentLang
  }
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName || 'nuxt-gsheet'}`,
  ogSiteName: seo?.siteName || 'nuxt-gsheet',
  twitterCard: 'summary_large_image'
})

provide('navigation', currentNavigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="currentNavigation"
      />
    </ClientOnly>
  </UApp>
</template>
