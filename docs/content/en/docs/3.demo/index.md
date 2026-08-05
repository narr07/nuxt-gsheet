---
title: Live Demo
description: Explore the live playground implementation of nuxt-gsheet with CRUD capabilities.
---

# Live Demo

The `nuxt-gsheet` package includes a built-in playground environment. This playground serves as a live, interactive reference implementation where you can view raw grids, parse objects, and perform real-time database modifications on Google Sheets.

## Running the Playground

You can start the playground dev server locally to interact with the demo. Execute the following command from the root of the repository:

```bash [Terminal]
# Install dependencies and start playground
bun install
bun run dev
```

Open your browser and navigate to `http://localhost:3000` to see the live data table rendered directly from a public Google Spreadsheet.

## Demo Implementation Code

The playground dashboard uses our auto-imported client composables. It fetches the public spreadsheet, binds the raw grid to a custom data grid, converts the rows to JavaScript objects, and prints a single header row as index tags.

Here is the simplified `app.vue` template of the demo dashboard:

```vue [playground/app.vue]
<script setup>
// Fetches cell grid. Returns { data, pending, error, refresh }
const { data: rawData, pending, error, refresh } = await useGSheet('Class Data!A1:F10')

// Automatically maps cell values to header keys
const { data: objects } = await useGSheetAsObject('Class Data!A1:F10')

// Extracts row 0 (headers)
const { data: headerRow } = await useGSheetRow('Class Data!A1:F10', 0)
</script>

<template>
  <main class="dashboard">
    <!-- Header tags from row 0 -->
    <div class="tags-container">
      <span v-for="tag in headerRow" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>

    <!-- Raw Data Grid -->
    <table class="grid-table">
      <tr v-for="(row, idx) in rawData" :key="idx">
        <td v-for="(cell, cIdx) in row" :key="cIdx">
          {{ cell }}
        </td>
      </tr>
    </table>
  </main>
</template>
```

## Google Apps Script Proxy Demo

Below is the active Google Apps Script Web App endpoint used in `appscript` mode for secure read and write operations:

```env [.env]
GSHEET_APPSCRIPT_URL=https://script.google.com/macros/s/AKfycbzxQy164ISaJVAwErxdp5GKAeypRiW_H8-EM2Zxo6MZA_kRyY_x9-OmhJvnYZWReCFRJA/exec
```

```vue [app.vue]
<script setup>
// Live Apps Script proxy read and write
const { data: siswa, pending, refresh } = await useGSheetAsObject('A1:Z100', {
  sheet: 'siswa',
  mode: 'appscript',
  appscriptUrl: 'https://script.google.com/macros/s/AKfycbzxQy164ISaJVAwErxdp5GKAeypRiW_H8-EM2Zxo6MZA_kRyY_x9-OmhJvnYZWReCFRJA/exec'
})
</script>

<template>
  <div class="data-container">
    <div class="header">
      <h2>Student Data</h2>
      <button :disabled="pending" @click="refresh()">
        Refresh Data
      </button>
    </div>

    <!-- Render data in a table -->
    <table v-if="siswa?.length" class="data-table">
      <thead>
        <tr>
          <th v-for="(val, key) in siswa[0]" :key="key">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in siswa" :key="index">
          <td v-for="(val, key) in row" :key="key">
            {{ val }}
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="pending">Loading data from Google Sheets...</p>
  </div>
</template>
```
