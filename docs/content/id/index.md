---
seo:
  title: Dokumentasi nuxt-gsheet
  description: Integrasi Google Sheets super cepat tanpa konfigurasi rumit untuk Nuxt 3 dan 4 dengan perlindungan cache dogpile, multi-mode, dan metrik DevTools.
---

::u-page-hero{class="dark:bg-gradient-to-b from-zinc-900 to-zinc-950"}
---
orientation: horizontal
---
#top
:hero-background

#title
Integrasikan [Google Sheets]{.text-primary} Secara Instan.

#description
Gunakan kemudahan Google Sheets sebagai database Anda. Pengambilan data publik tanpa API Key, proxy Google Apps Script yang aman, tanda tangan JWT Service Account, dan sistem caching anti-stampede.

#links
  :::u-button
  ---
  to: /id/getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Memulai Cepat
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
  ```vue [app.vue]
  const { data: siswa } = await useGSheetAsObject('A1:Z100', {
    sheet: 'siswa',
    cacheMaxAge: 300
  })
  ```
  :::
::

::u-page-section{title="Fitur Unggulan" description="Semua yang Anda butuhkan untuk mengubah spreadsheet menjadi API endpoint yang tangguh."}

  :::u-page-grid
    ::::u-page-card
    ---
    title: Berbagai Mode Autentikasi
    description: Mendukung Google Query Language (GViz), ekspor CSV langsung, Google Apps Script yang aman, API Key standar, serta Service Account.
    icon: i-lucide-shield-check
    ---
    ::::

    ::::u-page-card
    ---
    title: Smart Locking Cache
    description: Melindungi API dari cache stampede/dogpile, menyajikan data cache lama (stale) jika koneksi Google error atau terkena limit kuota.
    icon: i-lucide-refresh-cw
    ---
    ::::

    ::::u-page-card
    ---
    title: Composables Type-Safe
    description: Hooks client auto-import untuk membaca grid sel, mengekstrak baris tunggal, men-transpose tabel menjadi key-value objek, dan menulis data.
    icon: i-lucide-layers
    ---
    ::::
  :::
::
