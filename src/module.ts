import { defineNuxtModule, addServerHandler, addImportsDir, addComponent, createResolver } from '@nuxt/kit'
import type { ModuleOptions } from './types'

export type { ModuleOptions }

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'nuxt-gsheet',
		configKey: 'gsheet',
		compatibility: {
			nuxt: '>=3.10.0'
		}
	},
	defaults: {
		auth: undefined, // auto-detect
		apiKey: undefined,
		spreadsheetId: undefined,
		appscriptUrl: undefined,
		credentials: {
			clientEmail: '',
			privateKey: ''
		},
		sheets: {},
		cache: {
			enabled: true,
			maxAge: 300,
			storage: 'memory'
		}
	},
	setup(options, nuxt) {
		const resolver = createResolver(import.meta.url)

		// Each server route ships two entries: one written against `nuxt/server`, which runs on
		// any server builder (Nuxt 4.6+ and Nuxt 5), and a `.legacy` one for Nitro v2 and h3 v1
		const serverHandler = (file: string) => ({
			nuxt: resolver.resolve(file),
			nitro2: resolver.resolve(file + '.legacy')
		})

		// Expose module configurations to runtime configuration
		// Use defu (deep config merging) to merge options
		nuxt.options.runtimeConfig.gsheet = {
			...nuxt.options.runtimeConfig.gsheet,
			...options
		} as any

		// Register server proxy handlers
		addServerHandler({
			route: '/api/_gsheet/values/:range',
			method: 'get',
			handler: serverHandler('./runtime/server/api/_gsheet/values/[range].get')
		})

		addServerHandler({
			route: '/api/_gsheet/append',
			method: 'post',
			handler: serverHandler('./runtime/server/api/_gsheet/append.post')
		})

		addServerHandler({
			route: '/api/_gsheet/update',
			method: 'put',
			handler: serverHandler('./runtime/server/api/_gsheet/update.put')
		})

		addServerHandler({
			route: '/api/_gsheet/clear',
			method: 'delete',
			handler: serverHandler('./runtime/server/api/_gsheet/clear.delete')
		})

		// Register Metrics and DevTools handlers in development only:
		// they expose config metadata (spreadsheet ID, Apps Script URL)
		if (nuxt.options.dev) {
			addServerHandler({
				route: '/api/_gsheet/metrics',
				method: 'get',
				handler: serverHandler('./runtime/server/api/_gsheet/metrics.get')
			})

			addServerHandler({
				route: '/api/_gsheet/devtools',
				method: 'get',
				handler: serverHandler('./runtime/server/api/_gsheet/devtools.get')
			})
		}

		// Enable auto-importing of client composables
		addImportsDir(resolver.resolve('./runtime/composables'))

		// Register <GsheetTable> globally so markdown renderers can resolve ::gsheet-table
		addComponent({
			name: 'GsheetTable',
			filePath: resolver.resolve('./runtime/components/GsheetTable.vue'),
			global: true
		})

		// Hook into Nuxt DevTools to append a custom tab
		// @ts-ignore
		nuxt.hook('devtools:customTabs', (tabs) => {
			tabs.push({
				name: 'gsheet',
				title: 'Google Sheets',
				icon: 'vscode-icons:file-type-excel',
				view: {
					type: 'iframe',
					src: '/api/_gsheet/devtools'
				}
			})
		})
	}
})
