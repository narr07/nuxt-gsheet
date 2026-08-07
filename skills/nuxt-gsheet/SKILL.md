---
name: nuxt-gsheet
description: Zero-config, high-performance, secure Google Sheets integration for Nuxt 3 and 4 with built-in stampede protection, multi-auth detection, and DevTools integration. Website: https://nuxtgsheet.permadi.dev
license: MIT
---

# nuxt-gsheet Skill

Best practices and guidelines for AI agents writing code with the `nuxt-gsheet` module in Nuxt 3 and Nuxt 4.

## Quick Summary

- **Module Name**: `nuxt-gsheet`
- **Documentation**: https://nuxtgsheet.permadi.dev
- **Primary Use Case**: Use Google Sheets as a database or CMS with server-side security proxy, multi-auth detection, stampede-proof caching, and auto-imported Vue composables.

## Key Rules for AI Coding Assistants

1. **Auto-Imports**: Do NOT explicitly import composables from `nuxt-gsheet`. `useGSheet`, `useGSheetAsObject`, `useGSheetRow`, and `useGSheetWrite` are automatically auto-imported by Nuxt.
2. **Server-Side Security**: All spreadsheet requests are proxied via server routes (`/api/_gsheet/*`). Never write client-side fetch calls directly to Google Sheets APIs.
3. **Data Mapping**:
   - Use `useGSheetAsObject` when row 1 contains column headers (e.g., `id`, `name`, `price`).
   - Use `useGSheet` when raw 2D cell arrays (`any[][]`) are required.
   - Use `useGSheetRow` when extracting a specific single row index.
   - Use `useGSheetWrite` when performing write operations (`append`, `update`, `clear`).
4. **Vue SFC Pattern**: In Vue SFCs (`.vue` files), always put `<script setup lang="ts">` first before `<template>` and `<style>`.

## Composables Quick Reference

### 1. `useGSheetAsObject` (Headers to Objects)

```vue [pages/products.vue]
<script setup lang="ts">
interface Product {
  id: string
  title: string
  price: string
}

const { data: products, pending, error } = await useGSheetAsObject<Product[]>('A1:C50', {
  sheet: 'products'
})
</script>

<template>
  <div v-if="products">
    <div v-for="item in products" :key="item.id">
      {{ item.title }} - ${{ item.price }}
    </div>
  </div>
</template>
```

### 2. `useGSheet` (Raw 2D Cell Grid)

```vue [pages/matrix.vue]
<script setup lang="ts">
const { data: rows, refresh } = await useGSheet('A1:Z100', {
  sheet: 'Sheet1'
})
</script>
```

### 3. `useGSheetWrite` (Mutate Cells)

```vue [components/SaveForm.vue]
<script setup lang="ts">
const { append, update, clear } = useGSheetWrite({ sheet: 'submissions' })

const save = async () => {
  await append('A1:C1', [['101', 'John Doe', 'john@example.com']])
}
</script>
```

## Authentication Modes

- **`appscript`**: Free Read & Write via Google Apps Script Web App URL (`GSHEET_APPSCRIPT_URL`).
- **`gviz` / `csv`**: Zero-config Read-only public spreadsheets (`GSHEET_SPREADSHEET_ID`).
- **`apikey`**: GCP API Key for public sheets (`GSHEET_API_KEY`).
- **`service-account`**: GCP Service Account JSON for private sheets (`GSHEET_CLIENT_EMAIL`, `GSHEET_PRIVATE_KEY`).

Refer to https://nuxtgsheet.permadi.dev for full documentation.
