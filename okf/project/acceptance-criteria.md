---
type: Concept
title: "Acceptance Criteria"
description: "Acceptance criteria checklist for the nuxt-gsheet module release."
tags: [project, release, testing]
---

# Acceptance Criteria

The final module release must satisfy the following checklist items:

## Core Module

- [ ] Installable via `npx nuxi module add nuxt-gsheet`.
- [ ] Compatible with Nuxt 3.10+ and Nuxt 4.x versions.
- [ ] Operates across SSR, SSG, SPA, and Hybrid environments.
- [ ] Sensitive API credentials (e.g. API keys) are fully isolated and not leaked to client-side bundles (verifiable via developer tools).
- [ ] Compatible with Edge platforms including Cloudflare Pages and Cloudflare Workers.
- [ ] Fully typed in TypeScript without relying on `any` types.
- [ ] Minimum of 80% code test coverage.
- [ ] Integrates a custom panel in Nuxt DevTools.
- [ ] Mode `appscript` runs without requiring standard API keys or GCP service account credentials.
- [ ] Mode `gviz` automatically parses the Visualization JSON format.
- [ ] Mode `gviz` supports Google Query Language filters (`SELECT`, `WHERE`, `ORDER BY`).
- [ ] Mode `csv` automatically parses the exported sheet into arrays of objects utilizing headers.
- [ ] Autodetects authentication mode configurations dynamically.
- [ ] Clear error logs when access is unauthorized or spreadsheet is public sharing disabled.

## Documentation Website (`/docs`)

- [ ] Folder `docs/` is independent from the source module (`src/`).
- [ ] English routes work: `/getting-started`, `/composables/use-gsheet`.
- [ ] Indonesian routes work: `/id/getting-started`, `/id/composables/use-gsheet`.
- [ ] Language switcher is placed in the header and maintains the current page when toggling languages.
- [ ] Global search functions correctly in both languages (leveraging Nuxt UI Pro's built-in search).
- [ ] Deployable to Cloudflare Pages via `nuxt generate`.
- [ ] `tsconfig.json` uses the Nuxt 4 references format (rather than `extends`).
