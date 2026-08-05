<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const targetLocale = computed(() => (locale.value === 'en' ? 'id' : 'en'))
const targetPath = computed(() => switchLocalePath(targetLocale.value))
</script>

<template>
  <UButton
    color="neutral"
    variant="ghost"
    :label="locale.toUpperCase()"
    :to="targetPath"
    aria-label="Switch language"
  />
</template>
