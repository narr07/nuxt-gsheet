---
type: Concept
title: "Struktur Module"
description: "Proposed folder structure for the nuxt-gsheet Nuxt module."
tags: [architecture, structure, folder-layout]
---

# Struktur Module

This folder structure isolates module generation logic, server runtimes, composables, and client helpers.

## Directory Layout
```
nuxt-gsheet/
├── src/                    # Module source code
├── runtime/
│   ├── composables/
│   │   ├── useGSheet.ts
│   │   ├── useGSheetRow.ts
│   │   ├── useGSheetAsObject.ts
│   │   └── useGSheetWrite.ts
│   ├── server/
│   │   ├── api/
│   │   │   ├── _gsheet/
│   │   │   │   ├── values/[range].get.ts
│   │   │   │   ├── append.post.ts
│   │   │   │   ├── update.put.ts
│   │   │   │   └── clear.delete.ts
│   │   ├── plugins/
│   │   │   └── gsheet.ts  # Google client initialization
│   │   └── utils/
│   │       ├── auth.ts
│   │       ├── cache.ts
│   │       └── transform.ts
│   └── plugin.ts          # Client plugin (optional)
├── types.ts               # ModuleOptions definitions
├── playground/            # Nuxt app for testing
├── test/
├── package.json
└── README.md
```
