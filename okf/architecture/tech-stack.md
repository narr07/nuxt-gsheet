---
type: Concept
title: "Tech Stack & Dependencies"
description: "Third-party libraries and packages supporting the nuxt-gsheet module."
tags: [architecture, dependencies, tech-stack]
---

# Tech Stack & Dependencies

The module relies on the following core dependencies to build and function correctly:

| Package | Purpose |
|---|---|
| `@nuxt/kit` | Module builder API and compilation helpers |
| `googleapis` | Google Sheets API SDK (Node.js runtime only) |
| `unstorage` | Storage and caching abstraction layers |
| `defu` | Deep configurations merger |
| `h3` | Native server route helper library (already bundled in Nitro) |
