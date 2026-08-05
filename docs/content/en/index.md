---
seo:
  title: nuxt-gsheet Documentation
  description: Ultra-fast, zero-config Google Sheets integration for Nuxt 3 and 4 with built-in stampede protection, multiple modes, and DevTools metrics.
---

::u-page-hero{class="dark:bg-gradient-to-b from-zinc-900 to-zinc-950"}
---
orientation: horizontal
---
#top
:hero-background

#title
Integrate [Google Sheets]{.text-primary} Instantly.

#description
Unleash the power of Google Sheets as a database. Zero-config public reads, secure Apps Scripts proxies, Service Account JWT signing, and built-in stampede-proof caching.

#links
  :::u-button
  ---
  to: /docs/getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Get Started
  :::

  :::u-button
  ---
  icon: i-simple-icons-github
  color: neutral
  variant: outline
  size: xl
  to: https://github.com/
  target: _blank
  ---
  GitHub Repo
  :::

#default
  :::prose-pre
  ---
  code: |
    // Nuxt 3/4 auto-imported composable
    const { data: siswa } = await useGSheetAsObject('A1:Z100', {
      sheet: 'siswa',
      cacheMaxAge: 300 // 5 minutes cache
    })
  filename: app.vue
  ---

  ```vue [app.vue]
  const { data: siswa } = await useGSheetAsObject('A1:Z100', {
    sheet: 'siswa',
    cacheMaxAge: 300
  })
  ```
  :::
::

::u-page-section{title="Features" description="Everything you need to turn your spreadsheet into a robust API endpoint."}

  :::u-page-grid
    ::::u-page-card
    ---
    title: Multi-Authentication Modes
    description: Supports Google Query Language (GViz), direct CSV, secure custom Google Apps Scripts, API keys, and Service Accounts.
    icon: i-lucide-shield-check
    ---
    ::::

    ::::u-page-card
    ---
    title: Smart Locking Cache
    description: Implements cache stampede/dogpile protection, serving stale cache on Google API network errors or quota limits.
    icon: i-lucide-refresh-cw
    ---
    ::::

    ::::u-page-card
    ---
    title: Type-Safe Composables
    description: Auto-imported client hooks for grid extraction, single rows, transposing tables to key-value objects, and writing data.
    icon: i-lucide-layers
    ---
    ::::
  :::
::
