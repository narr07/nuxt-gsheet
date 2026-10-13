import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url))
	})

	it('renders the index page', async () => {
		// Get response to a server-rendered page with `$fetch`.
		const html = await $fetch('/')
		expect(html).toContain('<div>basic</div>')
	})

	it('renders <GsheetTable> on the server', async () => {
		const html = await $fetch<string>('/')
		expect(html).toContain('class="gsheet-table"')
		// columns="price,name" reorders the headers, limit="1" keeps one body row
		expect(html).toMatch(/<th scope="col">\s*price\s*<\/th>\s*<th scope="col">\s*name\s*<\/th>/)
		expect(html).toMatch(/<td>\s*18000\s*<\/td>\s*<td>\s*Kopi\s*<\/td>/)
		expect(html.match(/<th /g)).toHaveLength(2)
		expect(html.match(/<td>/g)).toHaveLength(2)
	})
})
