// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        }
      }
    },
    experimental: {
      sqliteConnector: 'native'
    }
  },

  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English' },
      { code: 'id', language: 'id-ID', name: 'Indonesia' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix',
    baseUrl: 'https://nuxtgsheet.permadi.dev'
  },

  llms: {
    domain: 'https://nuxtgsheet.permadi.dev',
    title: 'nuxt-gsheet',
    description: 'Ultra-fast, zero-config Google Sheets integration for Nuxt 3 and 4 with built-in stampede-proof caching, multiple auth modes, and DevTools metrics.',
    full: {
      title: 'nuxt-gsheet - Full Documentation',
      description: 'Complete documentation, composables API reference, and examples for nuxt-gsheet.'
    },
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'docs_en',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '%getting-started%' }
        ]
      },
      {
        title: 'Composables',
        contentCollection: 'docs_en',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '%composables%' }
        ]
      },
      {
        title: 'Demo',
        contentCollection: 'docs_en',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '%demo%' }
        ]
      }
    ]
  },

  mcp: {
    name: 'nuxt-gsheet'
  },

  ogImage: {
    zeroRuntime: true
  }
})
