<!-- app\pages\[...slug].vue -->
<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const { locale } = useI18n()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

// Pilih koleksi berdasarkan locale aktif (docs_en atau docs_id)
const collection = computed(() => locale.value === 'id' ? 'docs_id' : 'docs_en')

// Otomatis mencari /en/docs/intro atau /id/docs/intro berdasarkan route.path
const { data: page } = await useAsyncData(`docs-${locale.value}-${route.path}`, async () => {
  let doc = await queryCollection(collection.value).path(route.path).first()
  if (!doc) {
    const fallbackPath = route.path.startsWith('/id/')
      ? route.path.replace('/id/', '/id/docs/')
      : route.path.startsWith('/en/')
        ? route.path.replace('/en/', '/en/docs/')
        : `/en/docs${route.path}`
    doc = await queryCollection(collection.value).path(fallbackPath).first()
  }
  return doc
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// Ambil surround (sebelum/sesudah) dalam koleksi yang sama
const { data: surround } = await useAsyncData(`docs-${locale.value}-${route.path}-surround`, () => {
  return queryCollectionItemSurroundings(collection.value, route.path, {
    fields: ['description']
  })
})

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))

defineOgImage('Docs', { title, description, headline: headline.value })

const links = computed(() => {
  const links = []
  if (toc?.bottom?.edit) {
    links.push({
      icon: 'i-lucide-external-link',
      label: 'Edit this page',
      to: `${toc.bottom.edit}/${page?.value?.stem}.${page?.value?.extension}`,
      target: '_blank'
    })
  }

  return [...links, ...(toc?.bottom?.links || [])].filter(Boolean)
})
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
    >
      <template #links>
        <UButton
          v-for="(link, index) in page.links"
          :key="index"
          v-bind="link"
        />

        <PageHeaderLinks />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        :title="toc?.title"
        :links="page.body?.toc?.links"
        highlight
        highlight-color="primary"
        highlight-variant="circuit"
      />
    </template>
  </UPage>
</template>
