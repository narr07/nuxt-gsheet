import { useFetch } from '#app'
import { computed, ref } from 'vue'
import type { ComposablesOptions } from '../../types'

interface ExtendedComposablesOptions extends ComposablesOptions {
	key?: string
}

export function useGSheet<T = any>(range: string, options: ExtendedComposablesOptions = {}): {
	data: any
	pending: any
	error: any
	refresh: () => Promise<void>
	execute: () => Promise<void>
	status: any
} {
	const bypass = ref(false)

	const queryParams = computed(() => {
		const q: any = {}
		if (options.sheet) q.sheet = options.sheet
		if (options.valueRenderOption) q.valueRenderOption = options.valueRenderOption
		if (options.query) q.query = options.query

		if (options.cache === false || bypass.value) {
			q.bypassCache = 'true'
		}
		if (options.cacheMaxAge !== undefined) {
			q.cacheMaxAge = options.cacheMaxAge
		}
		return q
	})

	const fetchResult = useFetch<T>(`/api/_gsheet/values/${encodeURIComponent(range)}`, {
		key: options.key || `gsheet:${range}`,
		query: queryParams,
		transform: options.transform
	})

	const customRefresh = async () => {
		bypass.value = true
		try {
			await fetchResult.refresh()
		}
		finally {
			bypass.value = false
		}
	}

	return {
		data: fetchResult.data,
		pending: fetchResult.pending,
		error: fetchResult.error,
		refresh: customRefresh,
		execute: fetchResult.execute,
		status: fetchResult.status
	}
}
