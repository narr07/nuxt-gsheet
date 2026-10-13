import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch, fetch } from '@nuxt/test-utils/e2e'

const rows = [
	['name', 'price'],
	['Kopi', '18000'],
	['Teh', '9000']
]

describe('nuxt/server handlers', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('./fixtures/portable', import.meta.url))
	})

	it('reads values and decodes the range from the URL', async () => {
		const res = await fetch(`/api/_portable/values/${encodeURIComponent('A1:B3')}?sheet=Menu`)

		expect(res.status).toBe(200)
		expect(res.headers.get('x-cache')).toBe('MISS')
		expect(await res.json()).toEqual(rows)
	})

	it('serves the second request from cache', async () => {
		const res = await fetch(`/api/_portable/values/${encodeURIComponent('A1:B3')}?sheet=Menu`)

		expect(res.headers.get('x-cache')).toBe('HIT')
		expect(await res.json()).toEqual(rows)
	})

	it('returns the same data as the legacy handler', async () => {
		expect(await $fetch(`/api/_gsheet/values/${encodeURIComponent('A1:B3')}?sheet=Menu`)).toEqual(rows)
	})

	it('rejects writes in a read-only mode with a JSON error', async () => {
		const res = await fetch('/api/_portable/append', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ sheet: 'Menu', values: [['Susu', '12000']] })
		})

		expect(res.status).toBe(500)
		expect(await res.text()).toContain('Append failed')
	})

	it('reports metrics and safe config', async () => {
		const res = await $fetch<{ metrics: { totalRequests: number }, config: { auth: string } }>('/api/_portable/metrics')

		expect(res.config.auth).toBe('csv')
		expect(res.metrics.totalRequests).toBeGreaterThan(0)
	})

	it('serves the devtools page as HTML', async () => {
		const res = await fetch('/api/_portable/devtools')

		expect(res.headers.get('content-type')).toContain('text/html')
		expect(await res.text()).toContain('Google Sheets Module DevTools')
	})
})
