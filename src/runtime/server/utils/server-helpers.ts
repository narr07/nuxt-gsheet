/**
 * The request helpers the handlers need, supplied by each server runtime:
 * `nuxt/server` in `helpers.ts`, h3 v1 in `helpers.legacy.ts`.
 */
export interface ServerHelpers<Event> {
	createError: (input: { status: number, statusText: string, data?: unknown }) => Error
	getRouterParam: (event: Event, name: string) => string | undefined
	getQuery: (event: Event) => Record<string, unknown>
	readBody: (event: Event) => Promise<any>
	setHeaders: (event: Event, headers: Record<string, string>) => void
	useRuntimeConfig: () => any
}
