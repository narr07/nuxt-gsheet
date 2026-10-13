import { defineEventHandler, getRequestURL } from 'h3'

// Stand-in for Google Sheets so the fixture needs no network access
export default defineEventHandler((event) => {
	if (getRequestURL(event).pathname.startsWith('/api/_gsheet/values/')) {
		return [
			['name', 'price', 'stock'],
			['Kopi', '18000', '12'],
			['Teh', '9000', '30']
		]
	}
})
