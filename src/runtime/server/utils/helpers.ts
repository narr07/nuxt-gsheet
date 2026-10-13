import { createError, getQuery, getRouterParam, readBody, useRuntimeConfig } from 'nuxt/server'
import type { RequestEvent } from 'nuxt/server'
import type { ServerHelpers } from './server-helpers'

export const helpers: ServerHelpers<RequestEvent> = {
	createError,
	// `nuxt/server` reports params as they appear in the URL, so decode them
	getRouterParam: (event, name) => getRouterParam(event, name, { decode: true }),
	getQuery,
	readBody,
	setHeaders: (event, headers) => {
		for (const [name, value] of Object.entries(headers)) {
			event.res.headers.set(name, value)
		}
	},
	useRuntimeConfig
}
