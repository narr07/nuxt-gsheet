import { addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'
import MyModule from '../../../src/module'

// Registers the `nuxt/server` entries on their own. With no `nitro2` variant
// beside them, they are the ones that run, even on a Nitro v2 host.
const portableRoutes = defineNuxtModule({
	meta: { name: 'portable-routes' },
	setup() {
		const { resolve } = createResolver(import.meta.url)
		const api = resolve('../../../src/runtime/server/api/_gsheet')

		addServerHandler({ route: '/api/_portable/values/:range', method: 'get', handler: { nuxt: `${api}/values/[range].get` } })
		addServerHandler({ route: '/api/_portable/append', method: 'post', handler: { nuxt: `${api}/append.post` } })
		addServerHandler({ route: '/api/_portable/metrics', method: 'get', handler: { nuxt: `${api}/metrics.get` } })
		addServerHandler({ route: '/api/_portable/devtools', method: 'get', handler: { nuxt: `${api}/devtools.get` } })
	}
})

export default defineNuxtConfig({
	modules: [
		MyModule,
		portableRoutes
	],
	gsheet: {
		auth: 'csv',
		spreadsheetId: 'test-sheet'
	}
})
