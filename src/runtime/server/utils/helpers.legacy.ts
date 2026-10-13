import type { H3Event } from 'h3'
import { createError, getQuery, getRouterParam, readBody, setHeaders } from 'h3'
import type { ServerHelpers } from './server-helpers'
import { useRuntimeConfig } from '#imports'

export const helpers: ServerHelpers<H3Event> = {
	createError: ({ status, statusText, data }) => createError({ statusCode: status, statusMessage: statusText, data }),
	getRouterParam,
	getQuery,
	readBody,
	setHeaders,
	useRuntimeConfig
}
