import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const linkSchema = z.object({
  links: z.array(z.object({
    label: z.string(),
    icon: z.string(),
    to: z.string(),
    target: z.string().optional()
  })).optional()
})

export default defineContentConfig({
  collections: {
    landing_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/index.md',
        prefix: '/'
      }
    }),
    landing_id: defineCollection({
      type: 'page',
      source: {
        include: 'id/index.md',
        prefix: '/id'
      }
    }),
    docs_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/**',
        exclude: ['en/index.md'],
        prefix: '/'
      },
      schema: linkSchema
    }),
    docs_id: defineCollection({
      type: 'page',
      source: {
        include: 'id/**',
        exclude: ['id/index.md'],
        prefix: '/id'
      },
      schema: linkSchema
    })
  }
})
