import { defineNuxtModule, addServerHandler, addImportsDir, createResolver } from '@nuxt/kit'
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

		// Expose module configurations to runtime configuration
		// Use defu (deep config merging) to merge options
		nuxt.options.runtimeConfig.gsheet = {
			...nuxt.options.runtimeConfig.gsheet,
			...options
		}

		// Register server proxy handlers
		addServerHandler({
			route: '/api/_gsheet/values/:range',
			method: 'get',
			handler: resolver.resolve('./runtime/server/api/_gsheet/values/[range].get')
		})

		addServerHandler({
			route: '/api/_gsheet/append',
			method: 'post',
			handler: resolver.resolve('./runtime/server/api/_gsheet/append.post')
		})

		addServerHandler({
			route: '/api/_gsheet/update',
			method: 'put',
			handler: resolver.resolve('./runtime/server/api/_gsheet/update.put')
		})

		addServerHandler({
			route: '/api/_gsheet/clear',
			method: 'delete',
			handler: resolver.resolve('./runtime/server/api/_gsheet/clear.delete')
		})

		// Register Metrics and DevTools handlers
		addServerHandler({
			route: '/api/_gsheet/metrics',
			method: 'get',
			handler: resolver.resolve('./runtime/server/api/_gsheet/metrics.get')
		})

		addServerHandler({
			route: '/api/_gsheet/devtools',
			method: 'get',
			handler: resolver.resolve('./runtime/server/api/_gsheet/devtools.get')
		})

		// Enable auto-importing of client composables
		addImportsDir(resolver.resolve('./runtime/composables'))

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
