import { fileURLToPath } from 'node:url'
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const common = z.object({
  links: z.array(z.object({
    label: z.string(),
    icon: z.string(),
    to: z.string(),
    target: z.string().optional()
  })).optional()
})

export default defineContentConfig({
  collections: {
    docs_en: defineCollection({
      type: 'page',
      source: {
        include: '**',
        cwd: fileURLToPath(new URL('./content/en/docs', import.meta.url)),
        prefix: '/en/docs'
      },
      schema: common
    }),
    docs_id: defineCollection({
      type: 'page',
      source: {
        include: '**',
        cwd: fileURLToPath(new URL('./content/id/docs', import.meta.url)),
        prefix: '/id/docs'
      },
      schema: common
    }),
    landing_en: defineCollection({
      type: 'page',
      source: {
        include: 'index.md',
        cwd: fileURLToPath(new URL('./content/en', import.meta.url)),
        prefix: '/en'
      }
    }),
    landing_id: defineCollection({
      type: 'page',
      source: {
        include: 'index.md',
        cwd: fileURLToPath(new URL('./content/id', import.meta.url)),
        prefix: '/id'
      }
    })
  }
})
