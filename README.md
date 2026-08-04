# nuxt-gsheet

[![npm version](https://img.shields.io/npm/v/nuxt-gsheet/latest.svg?style=flat&colorA=020420&colorB=00DC82)](https://npmjs.com/package/nuxt-gsheet)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-gsheet.svg?style=flat&colorA=020420&colorB=00DC82)](https://npm.chart.dev/nuxt-gsheet)
[![License](https://img.shields.io/npm/l/nuxt-gsheet.svg?style=flat&colorA=020420&colorB=00DC82)](https://npmjs.com/package/nuxt-gsheet)
[![Nuxt](https://img.shields.io/badge/Nuxt-020420?logo=nuxt)](https://nuxt.com)

Ultra-fast, zero-config Google Sheets integration for Nuxt 3 and Nuxt 4. Use Google Sheets as a database with built-in stampede-proof caching, multi-authentication modes (including API-free GViz and Apps Script), and a custom DevTools dashboard.

- [✨ &nbsp;Release Notes](./CHANGELOG.md)
- [📖 &nbsp;Bilingual Documentation](./docs)

## Features

- **⚡️ Multi-Auth Detection**: Automatically detects and handles Google Query Language (GViz), direct CSV exporting, Google Apps Script proxies, API Keys, and Service Account credentials.
- **🔒 Secure Server Proxy**: Keeps Google sheet URLs, API keys, and Service Account JWT tokens strictly on the server-side, hiding them from the client browser.
- **🛡️ Stampede Lock Protection**: Serves stale cache on network/quota failure and prevents concurrent fetches from overloading your Apps Script or API quota limit.
- **🧪 Type-Safe Composables**: Auto-imported client hooks to extract cell grids (`useGSheet`), transposing rows to JavaScript objects (`useGSheetAsObject`), retrieving specific rows (`useGSheetRow`), and writing data (`useGSheetWrite`).
- **📊 DevTools Dashboard**: Real-time tracking of intercepted API calls, cache hit/miss ratio, active auth mode, and estimated API quota usage.

## Quick Setup

Install the module to your Nuxt application:

```bash
bun add nuxt-gsheet
# or pnpm add nuxt-gsheet
# or npm install nuxt-gsheet
```

Add `nuxt-gsheet` to the `modules` section of your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-gsheet'],

  gsheet: {
    // Configure default options here
    cache: {
      enabled: true,
      maxAge: 300 // 5 minutes cache
    }
  }
})
```

## Environment Variables

Configure your credentials securely in your `.env` file:

```env
# Google Apps Script Web App URL (Mode: appscript)
GSHEET_APPSCRIPT_URL=https://script.google.com/macros/s/.../exec

# Google Sheets Spreadsheet ID (Modes: gviz, csv, apikey, service-account)
GSHEET_SPREADSHEET_ID=your-spreadsheet-id-here

# API Key (Mode: apikey)
GSHEET_API_KEY=your-google-api-key

# Service Account Credentials (Mode: service-account)
GSHEET_CLIENT_EMAIL=your-service-account-email@gcp.com
GSHEET_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Basic Usage

### Fetching Rows as Objects
Automatically maps column values to the header labels on the first row of your spreadsheet range:

```vue
<script setup>
// Automatically auto-imported in Nuxt 3/4
const { data: students, pending, error } = await useGSheetAsObject('A1:C10', {
  sheet: 'siswa'
})
</script>

<template>
  <ul v-if="students">
    <li v-for="student in students" :key="student.nis">
      {{ student.nama }} - {{ student.kelas }}
    </li>
  </ul>
</template>
```

### Writing Data
Supports appending, updating, and clearing cell values (requires `appscript` or `service-account` mode):

```vue
<script setup>
const { append, pending } = useGSheetWrite({ sheet: 'siswa' })

const saveRecord = async () => {
  await append('A1:C1', [
    ['10023', 'John Doe', 'Kelas 10']
  ])
}
</script>

<template>
  <button :disabled="pending" @click="saveRecord">
    Add Record
  </button>
</template>
```

## Contribution

For local development:

```bash
# Install dependencies
bun install

# Generate type stubs
bun run dev:prepare

# Start playground development server
bun run dev

# Run Vitest tests
bun run test
```

## License

[MIT License](./LICENSE)
