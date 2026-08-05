<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const { locale } = useI18n()
const i18nHead = useLocaleHead({ seo: true })

// Pilih koleksi berdasarkan locale aktif (docs_en atau docs_id)
const collection = computed(() => locale.value === 'id' ? 'docs_id' : 'docs_en')

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs
}))

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

import type { ContentNavigationItem } from '@nuxt/content'

const { data: rawNavigation } = await useAsyncData(`navigation-${locale.value}`, () => queryCollectionNavigation(collection.value), { watch: [locale] })

function cleanNavigation(items: ContentNavigationItem[] | null | undefined): ContentNavigationItem[] {
  if (!items || !items.length) return []
  let result = items
  if (result.length === 1 && (result[0].title?.toLowerCase() === 'en' || result[0].title?.toLowerCase() === 'id') && result[0].children) {
    result = result[0].children
  }
  if (result.length === 1 && result[0].title?.toLowerCase() === 'docs' && result[0].children) {
    result = result[0].children
  }
  function transformItem(item: ContentNavigationItem): ContentNavigationItem {
    if (item.children?.length === 1 && (item.children[0].path === item.path || item.children[0].stem?.endsWith('/index'))) {
      return { ...item, path: item.children[0].path || item.path, children: undefined }
    }
    if (item.children?.length) {
      return { ...item, children: item.children.map(transformItem) }
    }
    return item
  }
  return result.map(transformItem)
}

const navigation = computed(() => cleanNavigation(rawNavigation.value))

const { data: files } = useLazyAsyncData(`search-${locale.value}`, () => queryCollectionSearchSections(collection.value), {
  server: false,
  watch: [locale]
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <AppHeader />

    <UError :error="error" />

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
