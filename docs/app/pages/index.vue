<!-- app\pages\index.vue -->
<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()

// Gunakan computed untuk menentukan koleksi (landing_en atau landing_id)
const collectionName = computed(() => locale.value === 'id' ? 'landing_id' : 'landing_en')

// Data ditarik berdasarkan path saat ini (/ atau /id)
const { data: page } = await useAsyncData(`index-${locale.value}-${route.path}`, () => {
  const targetPath = route.path.replace(/\/$/, '') || '/'
  return queryCollection(collectionName.value).path(targetPath).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Halaman tidak ditemukan', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/docs-light.png'
})
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
    :prose="false"
  />
</template>
