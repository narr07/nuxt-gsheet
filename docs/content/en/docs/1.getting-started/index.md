---
title: Getting Started
description: Learn how to install, configure, and secure your Google Sheets integration in Nuxt.
---

# Getting Started

The `nuxt-gsheet` module provides a high-performance, secure, and type-safe integration between Nuxt and Google Sheets. It supports multiple authentication modes, server-side proxying, stampede-proof caching, and custom DevTools metrics.

## Installation

Add the module to your Nuxt project dependencies:

```bash [Terminal]
bun add nuxt-gsheet
```

## Basic Configuration

Register the module in your `nuxt.config.ts` file. 

```ts [nuxt.config.ts]
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

## Security & Environment Variables

To protect your Google sheet URLs, API keys, or private key credentials, store them in your `.env` file. The server-side proxy reads these environment variables automatically. Because requests are proxied on the server, these credentials are never exposed to the client browser.

Add the variables to your environment:

```env [.env]
# Google Apps Script Web App URL (Mode: appscript)
GSHEET_APPSCRIPT_URL=https://script.google.com/macros/s/AKfycbzxQy164ISaJVAwErxdp5GKAeypRiW_H8-EM2Zxo6MZA_kRyY_x9-OmhJvnYZWReCFRJA/exec

# Google Sheets Spreadsheet ID (Modes: gviz, csv, apikey, service-account)
GSHEET_SPREADSHEET_ID=your-spreadsheet-id-here

# API Key (Mode: apikey)
GSHEET_API_KEY=your-google-api-key

# Service Account Credentials (Mode: service-account)
GSHEET_CLIENT_EMAIL=your-service-account-email@gcp.com
GSHEET_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Authentication Modes

The module automatically detects the best mode to use based on your active credentials:

| Mode | Authentication Method | Capabilities | API Key Required |
| --- | --- | --- | --- |
| `gviz` | Public URL Google Query | Read-only with GQL | No |
| `csv` | Direct CSV Export | Read-only | No |
| `appscript` | Apps Script Proxy | Read & Write | No |
| `apikey` | Standard Sheets API Key | Read-only | Yes |
| `service-account` | JWT signed requests | Read & Write | Yes (Service Account) |

::tip
Use `appscript` mode if you need simple read/write access without creating GCP Service Accounts or Google Cloud Console projects.
::
