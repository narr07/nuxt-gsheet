Siap! Ini PRD lengkap untuk **nuxt-gsheet** module dengan sistem OKF (Objectives, Key Features, Functional Requirements).

---

# PRD — `nuxt-gsheet` Module

**Version:** 1.0.0
**Target:** Nuxt 3.x & 4.x compatible
**Author:** \[Your Name\]
**Status:** Draft

---

## 🎯 OKF — Objectives, Key Features & Functional Requirements

---

### O1 — Objective: Kemudahan Integrasi Google Sheets ke Nuxt App

> Developer bisa mengambil data dari Google Sheets tanpa setup manual yang kompleks, cukup install module dan konfigurasi minimal.

**KF 1.1 — Zero-config auto-import composables**
- `useGSheet()` tersedia langsung tanpa perlu import manual
- `useGSheetRow()`, `useGSheetRange()` auto-imported di seluruh app

**KF 1.2 — Konfigurasi terpusat di `nuxt.config.ts`**
```ts
export default defineNuxtConfig({
  modules: ['nuxt-gsheet'],
  gsheet: {
    apiKey: process.env.GSHEET_API_KEY,
    spreadsheetId: 'your-spreadsheet-id',
    // atau multi-sheet
    sheets: {
      products: 'spreadsheet-id-1',
      users: 'spreadsheet-id-2',
    }
  }
})
```

**KF 1.3 — Support environment variables**
- Tidak ada hardcoded credentials
- `GSHEET_API_KEY`, `GSHEET_CLIENT_EMAIL`, `GSHEET_PRIVATE_KEY` dari `.env`

---

### O2 — Objective: Fleksibilitas Mode Autentikasi

> Support berbagai cara akses Google Sheets sesuai kebutuhan project (public, private, service account).

**KF 2.1 — Mode: API Key (Public Sheets)**
```ts
gsheet: {
  auth: 'apikey',
  apiKey: process.env.GSHEET_API_KEY,
}
```
- Cocok untuk spreadsheet yang di-share publik
- Hanya read-only

**KF 2.2 — Mode: Service Account (Private Sheets)**
```ts
gsheet: {
  auth: 'service-account',
  credentials: {
    clientEmail: process.env.GSHEET_CLIENT_EMAIL,
    privateKey: process.env.GSHEET_PRIVATE_KEY,
  }
}
```
- Bisa read & write
- Cocok untuk production apps

**KF 2.3 — Mode: OAuth2 (User Context)**
- Optional, untuk use case tertentu
- Redirect flow via server route `/api/gsheet/auth`

---

### O3 — Objective: Composables yang Powerful & Type-safe

> Developer mendapatkan DX yang baik dengan auto-completion dan TypeScript support penuh.

**KF 3.1 — `useGSheet(range, options?)`**
```ts
// app.vue atau halaman apapun
const { data, pending, error, refresh } = await useGSheet('Sheet1!A1:D10')

// Dengan options
const { data } = await useGSheet('Sheet1!A:Z', {
  sheet: 'products',      // jika multi-sheet config
  valueRenderOption: 'FORMATTED_VALUE',
  transform: (rows) => rows.map(([id, name, price]) => ({ id, name, price })),
  cache: true,
  cacheMaxAge: 60,        // detik
})
```

**KF 3.2 — `useGSheetRow(range, rowIndex, options?)`**
```ts
// Ambil satu baris spesifik
const { data } = await useGSheetRow('Sheet1!A:D', 0) // header row
```

**KF 3.3 — `useGSheetAsObject(range, options?)`**
```ts
// Auto-convert baris pertama sebagai header → array of objects
const { data } = await useGSheetAsObject('Sheet1!A:D')
// Result: [{ id: '1', name: 'Budi', email: 'budi@...' }]
```

**KF 3.4 — `useGSheetWrite(options?)` (jika service account)**
```ts
const { append, update, clear } = useGSheetWrite({ sheet: 'users' })
await append('Sheet1!A:D', [['4', 'Ani', 'ani@example.com']])
await update('Sheet1!B2', [['Updated Name']])
```

---

### O4 — Objective: Server-Side & Edge Ready

> Data fetching berjalan di server untuk performa dan keamanan (API key tidak expose ke client).

**KF 4.1 — Server Routes auto-generated**

Module otomatis membuat:
```
/api/_gsheet/values/:range
/api/_gsheet/append
/api/_gsheet/update
/api/_gsheet/clear
```

Composable di client-side memanggil internal API ini → API key **tidak pernah expose ke browser**.

**KF 4.2 — Nitro Server Plugin**
- Inisialisasi Google Sheets client di server startup
- Connection pooling untuk menghindari inisialisasi berulang
- Support Cloudflare Workers (via HTTP, bukan googleapis SDK native)

**KF 4.3 — SSR + SSG Support**
```ts
// SSR: data di-fetch saat render
const { data } = await useGSheet('Sheet1!A:D')

// SSG / prerender: data di-fetch saat build
// nuxt.config.ts
routeRules: {
  '/products': { prerender: true }
}
```

**KF 4.4 — Edge Runtime compat**
- Fallback ke REST API (`https://sheets.googleapis.com/v4/`) jika `googleapis` SDK tidak compatible
- Auto-detect runtime: Node.js → SDK, Edge/CF Workers → REST fetch

---

### O5 — Objective: Caching & Performance

> Tidak spam Google Sheets API quota.

**KF 5.1 — Built-in response caching**
```ts
gsheet: {
  cache: {
    enabled: true,
    maxAge: 300,     // 5 menit default
    storage: 'memory' // atau 'redis', 'fs'
  }
}
```

**KF 5.2 — Per-request cache override**
```ts
const { data } = await useGSheet('Sheet1!A:D', {
  cache: false,           // bypass cache sekali ini
  cacheMaxAge: 10,        // override global
})
```

**KF 5.3 — Cache invalidation**
```ts
const { refresh } = await useGSheet('Sheet1!A:D')
// Trigger refresh manual
await refresh()
```

---

### O6 — Objective: Developer Experience (DX) Excellent

**KF 6.1 — TypeScript generics**
```ts
interface Product {
  id: string
  name: string
  price: number
}

const { data } = await useGSheet<Product[]>('Sheet1!A:D', {
  transform: (rows) => rows.map(([id, name, price]) => ({
    id, name, price: Number(price)
  }))
})
// data.value sudah bertipe Product[]
```

**KF 6.2 — Nuxt DevTools integration**
- Panel khusus di Nuxt DevTools
- Tampil: sheet yang dikonfigurasi, jumlah request, cache status, quota usage

**KF 6.3 — Error handling yang informatif**
```ts
const { data, error } = await useGSheet('Sheet1!A:D')
if (error.value) {
  // error.value.code: 'QUOTA_EXCEEDED' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'NETWORK_ERROR'
  // error.value.message: human-readable
}
```

**KF 6.4 — Module playground & docs**
- Contoh: simple table, form submit, real-time polling
- Stackblitz playground ter-embed di docs

---

## 📦 Struktur Module

```
nuxt-gsheet/
├── src/
│   ├── module.ts              # Entry point Nuxt module
│   ├── runtime/
│   │   ├── composables/
│   │   │   ├── useGSheet.ts
│   │   │   ├── useGSheetRow.ts
│   │   │   ├── useGSheetAsObject.ts
│   │   │   └── useGSheetWrite.ts
│   │   ├── server/
│   │   │   ├── api/
│   │   │   │   ├── _gsheet/
│   │   │   │   │   ├── values/[range].get.ts
│   │   │   │   │   ├── append.post.ts
│   │   │   │   │   ├── update.put.ts
│   │   │   │   │   └── clear.delete.ts
│   │   │   ├── plugins/
│   │   │   │   └── gsheet.ts  # Init Google client
│   │   │   └── utils/
│   │   │       ├── auth.ts
│   │   │       ├── cache.ts
│   │   │       └── transform.ts
│   │   └── plugin.ts          # Client plugin (optional)
│   └── types.ts               # ModuleOptions types
├── playground/                # Nuxt app untuk test
├── test/
├── package.json
└── README.md
```

---

## 🚀 Tech Stack & Dependencies

| Package | Kegunakan |
|---|---|
| `@nuxt/kit` | Module builder |
| `googleapis` | Google Sheets API SDK (Node.js) |
| `unstorage` | Cache storage abstraction |
| `defu` | Deep merge options |
| `h3` | Server route utils (sudah bundled Nitro) |

---

## 📋 Acceptance Criteria

- [ ] Install via `npx nuxi module add nuxt-gsheet`
- [ ] Nuxt 3.10+ dan Nuxt 4.x compatible
- [ ] SSR, SSG, SPA, Hybrid semua berjalan
- [ ] API key tidak pernah expose ke browser (verifiable via devtools)
- [ ] Cloudflare Pages/Workers compatible
- [ ] TypeScript: 100% typed, no `any`
- [ ] Test coverage minimal 80%
- [ ] Nuxt DevTools panel berjalan

---

## 🗓️ Milestone

| Fase | Scope | Estimasi |
|---|---|---|
| **M1** | Core: API key mode, `useGSheet`, SSR | 1 minggu |
| **M2** | Service account, `useGSheetWrite`, cache | 1 minggu |
| **M3** | Edge compat, DevTools, generics TS | 3 hari |
| **M4** | Docs, playground, publish ke npm | 3 hari |

---

Mau lanjut ke tahap mana dulu? Saya bisa bantu:
- **Scaffold kode `module.ts`** beserta runtime composables
- **Setup playground** untuk testing
- **Template server route** untuk Google Sheets REST API



Bagus banget! Ini mode yang justru paling sering dipakai untuk project simpel karena **zero credential** — tinggal fetch URL publik. Ada beberapa teknik yang bisa di-support sekaligus.

---

## 🆕 Tambahan PRD — Mode: Public / No Auth

---

### O7 — Objective: Support Google Sheets Publik Tanpa API Key

> Developer bisa fetch data dari spreadsheet yang sudah dipublikasikan, tanpa perlu Google Cloud Console, API Key, atau Service Account sama sekali.

---

### KF 7.1 — Mode: Apps Script Web App (Recommended)

Cara kerja: User deploy Apps Script sebagai Web App publik → module fetch ke URL tersebut.

**Script yang perlu di-deploy user (di Google Sheets → Extensions → Apps Script):**
```js
// Code.gs
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheetName = e.parameter.sheet || ss.getSheets()[0].getName()
  const sheet = ss.getSheetByName(sheetName)
  const range = e.parameter.range

  let data
  if (range) {
    data = sheet.getRange(range).getValues()
  } else {
    data = sheet.getDataRange().getValues()
  }

  // Optional: auto convert row 1 sebagai header
  const asObject = e.parameter.asObject === 'true'
  let result = data

  if (asObject && data.length > 1) {
    const [headers, ...rows] = data
    result = rows.map(row =>
      Object.fromEntries(headers.map((h, i) => [h, row[i]]))
    )
  }

  return ContentService
    .createTextOutput(JSON.stringify({ data: result, sheet: sheetName }))
    .setMimeType(ContentService.MimeType.JSON)
}
```

**Konfigurasi di `nuxt.config.ts`:**
```ts
gsheet: {
  auth: 'appscript',
  appscriptUrl: process.env.GSHEET_APPSCRIPT_URL,
  // atau multi-sheet dengan URL berbeda
  sheets: {
    products: 'https://script.google.com/macros/s/xxx/exec',
    users: 'https://script.google.com/macros/s/yyy/exec',
  }
}
```

**Penggunaan:**
```ts
// Fetch semua data dari sheet pertama
const { data } = await useGSheet()

// Fetch sheet tertentu
const { data } = await useGSheet({ sheet: 'Sheet2' })

// Fetch dengan range
const { data } = await useGSheet({ sheet: 'Sheet1', range: 'A1:D10' })

// Auto-convert ke array of objects (pakai header row 1)
const { data } = await useGSheetAsObject({ sheet: 'Products' })
// → [{ id: '1', name: 'Tas', price: '150000' }]
```

---

### KF 7.2 — Mode: GViz JSON Feed (Tanpa Apps Script, Tanpa API Key)

Google punya endpoint tersembunyi yang mengembalikan data sebagai JSON — selama sheet-nya di-share publik (Anyone with the link - Viewer).

```
https://docs.google.com/spreadsheets/d/{ID}/gviz/tq?tqx=out:json&sheet={SheetName}
```

**Konfigurasi:**
```ts
gsheet: {
  auth: 'gviz',
  spreadsheetId: process.env.GSHEET_SPREADSHEET_ID,
}
```

**Cara kerja internal module:**
```ts
// runtime/server/utils/gviz.ts
export async function fetchGviz(spreadsheetId: string, sheet?: string, query?: string) {
  const url = new URL(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq`)
  url.searchParams.set('tqx', 'out:json')
  if (sheet) url.searchParams.set('sheet', sheet)
  if (query) url.searchParams.set('tq', query) // Google Query Language!

  const res = await fetch(url)
  const text = await res.text()

  // Response-nya bukan pure JSON, ada prefix yang perlu di-strip
  const json = JSON.parse(text.replace(/^[^(]+\(|\);?$/g, ''))
  return parseGvizResponse(json)
}
```

> ⚠️ **Catatan:** GViz response format agak unik (bukan array biasa), module akan handle parsing otomatis.

**Bonus — Support Google Query Language:**
```ts
// Bisa pakai SQL-like query!
const { data } = await useGSheet({
  sheet: 'Orders',
  query: 'SELECT A, B, C WHERE D > 100 ORDER BY B DESC LIMIT 10'
})
```

---

### KF 7.3 — Mode: CSV Export (Paling Simple)

Spreadsheet publik bisa di-export langsung sebagai CSV tanpa auth apapun.

```
https://docs.google.com/spreadsheets/d/{ID}/export?format=csv&gid={GID}
```

**Konfigurasi:**
```ts
gsheet: {
  auth: 'csv',
  spreadsheetId: process.env.GSHEET_SPREADSHEET_ID,
  sheets: {
    products: '0',        // gid=0 untuk Sheet1
    users: '123456789',  // gid dari URL sheet
  }
}
```

**Module auto-parse CSV → array of objects:**
```ts
const { data } = await useGSheet({ sheet: 'products' })
// Module pakai papaparse atau custom CSV parser
// → [{ id: '1', name: 'Produk A', price: '50000' }]
```

---

### 📊 Perbandingan Semua Mode Auth

| Mode | API Key | Setup | Read | Write | Edge/CF | Public Sheet |
|---|---|---|---|---|---|---|
| `apikey` | ✅ Required | Medium | ✅ | ❌ | ✅ | Both |
| `service-account` | ✅ Required | Complex | ✅ | ✅ | ⚠️ | Both |
| **`appscript`** | ❌ None | Easy | ✅ | ✅* | ✅ | Public |
| **`gviz`** | ❌ None | Zero | ✅ | ❌ | ✅ | Public only |
| **`csv`** | ❌ None | Zero | ✅ | ❌ | ✅ | Public only |

> *Write via Apps Script butuh custom `doPost()` di script-nya

---

### KF 7.4 — Auto-detect Mode

Module bisa detect mode otomatis dari config yang diberikan:

```ts
gsheet: {
  // Kalau ada appscriptUrl → pakai appscript mode
  appscriptUrl: '...',

  // Kalau ada spreadsheetId saja (tanpa apiKey) → pakai gviz mode
  spreadsheetId: '...',

  // Kalau ada apiKey → pakai apikey mode
  apiKey: '...',
}
```

---

### KF 7.5 — Write via Apps Script (`doPost`)

Untuk mode `appscript`, module support write operation tanpa API key:

**Tambahan di Apps Script user:**
```js
// Code.gs — tambahkan doPost
function doPost(e) {
  const body = JSON.parse(e.postData.contents)
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(body.sheet || 'Sheet1')

  if (body.action === 'append') {
    sheet.appendRow(body.row)
  } else if (body.action === 'update') {
    sheet.getRange(body.range).setValues(body.values)
  }

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON)
}
```

**Penggunaan di Nuxt:**
```ts
const { append, update } = useGSheetWrite()

// Append row baru
await append({ sheet: 'Orders', row: ['ORD-001', 'Budi', '150000'] })

// Update range
await update({ sheet: 'Orders', range: 'B2', values: [['Nama Baru']] })
```

---

### Update Acceptance Criteria

- [ ] Mode `appscript` berjalan tanpa API key/credential apapun
- [ ] Mode `gviz` auto-parse response format aneh dari Google
- [ ] Mode `gviz` support Google Query Language (`SELECT`, `WHERE`, `ORDER BY`)
- [ ] Mode `csv` auto-parse dengan header row otomatis
- [ ] Auto-detect mode dari config yang diberikan
- [ ] Semua mode public compatible dengan Cloudflare Pages/Workers
- [ ] Error message jelas saat sheet tidak public atau URL salah

---

Mau lanjut ke mana sekarang?

- 🔨 **Scaffold kode** — saya buatkan `module.ts` + semua composables
- 📄 **Template Apps Script** — script lengkap siap pakai dengan validasi & error handling
- 🧪 **Playground** — Nuxt app contoh untuk test semua mode



Siap! Saya ambilkan info template docs dan panduan module dulu ya.
Oke! Ini tambahan PRD lengkap untuk bagian **Docs Website**:

---

## 🆕 Tambahan PRD — Documentation Website (`/docs`)

---

### O8 — Objective: Dokumentasi Modul yang Profesional & Bilingual

> Website dokumentasi `nuxt-gsheet` tersedia dalam Bahasa Inggris dan Indonesia, built dengan Nuxt UI Docs template, tinggal deploy ke Cloudflare Pages.

---

### 📁 Struktur Folder

```
nuxt-gsheet/
├── src/                    # Source code module
├── playground/             # Playground testing
└── docs/                   # ← Dokumentasi website
    ├── app/
    │   ├── components/
    │   │   └── content/
    │   ├── pages/
    │   └── app.vue
    ├── content/
    │   ├── en/             # Konten Bahasa Inggris
    │   │   ├── 1.getting-started/
    │   │   │   ├── 1.index.md
    │   │   │   ├── 2.installation.md
    │   │   │   └── 3.configuration.md
    │   │   ├── 2.auth-modes/
    │   │   │   ├── 1.appscript.md
    │   │   │   ├── 2.gviz.md
    │   │   │   ├── 3.csv.md
    │   │   │   └── 4.api-key.md
    │   │   ├── 3.composables/
    │   │   │   ├── 1.use-gsheet.md
    │   │   │   ├── 2.use-gsheet-as-object.md
    │   │   │   └── 3.use-gsheet-write.md
    │   │   └── 4.deployment/
    │   │       ├── 1.cloudflare.md
    │   │       └── 2.vercel.md
    │   └── id/             # Konten Bahasa Indonesia
    │       ├── 1.getting-started/
    │       │   ├── 1.index.md
    │       │   ├── 2.instalasi.md
    │       │   └── 3.konfigurasi.md
    │       ├── 2.mode-autentikasi/
    │       │   ├── 1.appscript.md
    │       │   ├── 2.gviz.md
    │       │   ├── 3.csv.md
    │       │   └── 4.api-key.md
    │       ├── 3.composables/
    │       │   ├── 1.use-gsheet.md
    │       │   ├── 2.use-gsheet-as-object.md
    │       │   └── 3.use-gsheet-write.md
    │       └── 4.deployment/
    │           ├── 1.cloudflare.md
    │           └── 2.vercel.md
    ├── public/
    ├── nuxt.config.ts
    ├── package.json
    └── tsconfig.json
```

---

### KF 8.1 — Setup Awal dari Nuxt UI Docs Template

```bash
# Clone template ke folder docs
npx nuxi init docs --template github:nuxt-ui-templates/docs
cd docs
npm install
```

**`docs/package.json`:**
```json
{
  "name": "nuxt-gsheet-docs",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview"
  },
  "dependencies": {
    "@nuxt/content": "^3.x",
    "@nuxt/ui-pro": "latest",
    "@nuxtjs/i18n": "^9.x",
    "nuxt": "^4.x"
  }
}
```

---

### KF 8.2 — Konfigurasi i18n Bilingual

**`docs/nuxt.config.ts`:**
```ts
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        flag: '🇺🇸',
        // Konten EN
        files: ['en.json']
      },
      {
        code: 'id',
        language: 'id-ID',
        name: 'Indonesia',
        flag: '🇮🇩',
        files: ['id.json']
      },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    // EN  → /getting-started
    // ID  → /id/memulai
  },

  content: {
    // Konten per locale dari folder terpisah
    sources: {
      content: {
        driver: 'fs',
        prefix: '/docs',
        base: './content'
      }
    }
  },

  // Nuxt UI Pro config
  ui: {
    icons: ['heroicons', 'simple-icons']
  }
})
```

---

### KF 8.3 — Translation Files (UI Strings)

**`docs/i18n/locales/en.json`:**
```json
{
  "nav": {
    "docs": "Documentation",
    "api": "API Reference",
    "changelog": "Changelog",
    "github": "GitHub"
  },
  "home": {
    "hero": "Fetch Google Sheets data in Nuxt — zero config",
    "cta_start": "Get Started",
    "cta_demo": "See Demo"
  },
  "toc": "On this page",
  "prev": "Previous",
  "next": "Next",
  "edit": "Edit this page",
  "search": "Search docs...",
  "auth_modes": "Auth Modes",
  "composables": "Composables",
  "deployment": "Deployment"
}
```

**`docs/i18n/locales/id.json`:**
```json
{
  "nav": {
    "docs": "Dokumentasi",
    "api": "Referensi API",
    "changelog": "Riwayat Perubahan",
    "github": "GitHub"
  },
  "home": {
    "hero": "Ambil data Google Sheets di Nuxt — tanpa konfigurasi rumit",
    "cta_start": "Mulai Sekarang",
    "cta_demo": "Lihat Demo"
  },
  "toc": "Di halaman ini",
  "prev": "Sebelumnya",
  "next": "Selanjutnya",
  "edit": "Edit halaman ini",
  "search": "Cari dokumentasi...",
  "auth_modes": "Mode Autentikasi",
  "composables": "Composables",
  "deployment": "Deployment"
}
```

---

### KF 8.4 — Language Switcher Component

**`docs/app/components/LangSwitcher.vue`:**
```vue
<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const available = computed(() =>
  locales.value.filter(l => l.code !== locale.value)
)
</script>

<template>
  <UDropdownMenu
    :items="available.map(l => ({
      label: `${l.flag} ${l.name}`,
      onSelect: () => setLocale(l.code)
    }))"
  >
    <UButton variant="ghost" icon="i-heroicons-language">
      {{ locales.find(l => l.code === locale)?.flag }}
      {{ locale.toUpperCase() }}
    </UButton>
  </UDropdownMenu>
</template>
```

---

### KF 8.5 — Contoh Halaman Konten Bilingual

**`docs/content/en/1.getting-started/2.installation.md`:**
```md
---
title: Installation
description: Install nuxt-gsheet in your Nuxt project
---

## Quick Start

::code-group

```bash [npm]
npm install nuxt-gsheet
```

```bash [pnpm]
pnpm add nuxt-gsheet
```

::

Then add it to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-gsheet'],
  gsheet: {
    auth: 'appscript',
    appscriptUrl: process.env.GSHEET_APPSCRIPT_URL,
  }
})
```
```

**`docs/content/id/1.getting-started/2.instalasi.md`:**
```md
---
title: Instalasi
description: Pasang nuxt-gsheet di project Nuxt kamu
---

## Mulai Cepat

::code-group

```bash [npm]
npm install nuxt-gsheet
```

```bash [pnpm]
pnpm add nuxt-gsheet
```

::

Tambahkan ke `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-gsheet'],
  gsheet: {
    auth: 'appscript',
    appscriptUrl: process.env.GSHEET_APPSCRIPT_URL,
  }
})
```
```

---

### KF 8.6 — Navigation Config per Locale

**`docs/app/nuxt.schema.ts` / atau `content.config.ts`:**
```ts
// Sidebar navigation otomatis dari struktur folder content/en & content/id
// Nuxt Content v3 handle ini otomatis via file-based routing
```

Untuk override label navigation per locale, tambahkan di frontmatter:

```md
---
title: Installation        # EN title
navigation:
  title: Installation      # Override untuk sidebar
---
```

```md
---
title: Instalasi           # ID title
navigation:
  title: Instalasi
---
```

---

### KF 8.7 — Deploy ke Cloudflare Pages

**`docs/wrangler.toml`** (opsional, untuk D1 jika pakai nuxt-gsheet di docs sendiri):
```toml
name = "nuxt-gsheet-docs"
compatibility_date = "2024-01-01"
pages_build_output_dir = ".output/public"
```

**Build settings di Cloudflare Pages:**
```
Root directory    : docs
Build command     : npm run generate
Output directory  : docs/.output/public
Node version      : 22.x
```

---

### ✅ Update Acceptance Criteria — Docs

- [ ] Folder `docs/` independent dari source module (`src/`)
- [ ] Route EN: `/getting-started`, `/composables/use-gsheet`
- [ ] Route ID: `/id/getting-started`, `/id/composables/use-gsheet`
- [ ] Language switcher di header, mempertahankan halaman yang sama
- [ ] Search berfungsi di kedua bahasa (Nuxt UI Pro built-in)
- [ ] Deploy ke Cloudflare Pages via `nuxt generate`
- [ ] `tsconfig.json` pakai format Nuxt 4 references (bukan `extends`)

---

Langkah selanjutnya yang bisa saya bantu:
- 🔨 **Scaffold lengkap** — generate semua file sekaligus via IDE prompt
- 📝 **Draft konten** — tulis halaman getting-started dalam EN + ID
- ⚙️ **Integrasi** — sambungkan `nuxt-gsheet` module ke docs playground-nya sendiri
Prompt di atas bisa langsung di-open di Cursor atau Claude Code untuk scaffold semua file sekaligus.

Beberapa hal penting yang perlu diperhatikan:

**Struktur URL yang dihasilkan:**
- 🇺🇸 English (default): `/getting-started`, `/composables/use-gsheet`
- 🇮🇩 Indonesia: `/id/getting-started`, `/id/composables/use-gsheet`

**Catatan `@nuxtjs/i18n` untuk Nuxt 4:**
Kamu sudah pakai `@nuxtjs/i18n ^10.2.1` di project — itu sudah v11 compatible tapi perlu di-upgrade ke `^9.x` untuk Nuxt Content v3. Cek versi terbaru yang support Nuxt 4 karena di build log tadi ada warning `vue-i18n@10.0.8 deprecated`.

**Yang belum ada di template dan perlu ditambah manual:**
- `LangSwitcher.vue` di header (ada di prompt)
- Folder `content/en/` dan `content/id/` terpisah
- `i18n/locales/en.json` & `id.json` untuk UI strings

Mau saya bantu **draft konten halaman pertama** (`getting-started`) dalam bahasa EN + ID sekalian?
