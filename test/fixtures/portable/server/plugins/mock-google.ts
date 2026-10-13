// Stand-in for Google Sheets so the fixture needs no network access
export default () => {
	const realFetch = globalThis.fetch

	globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
		const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
		if (url.startsWith('https://docs.google.com/spreadsheets/d/test-sheet/export')) {
			return new Response('name,price\nKopi,18000\nTeh,9000', {
				headers: { 'content-type': 'text/csv' }
			})
		}
		return realFetch(input, init)
	}) as typeof fetch
}
