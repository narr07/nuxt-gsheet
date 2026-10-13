export interface RequestJsonOptions {
	method?: string
	headers?: Record<string, string>
	body?: unknown
}

/**
 * Minimal JSON request built on the web `fetch`, so the handlers do not rely
 * on a `$fetch` global that only some server runtimes provide.
 */
export async function requestJson<T = any>(url: string, options: RequestJsonOptions = {}): Promise<T> {
	const headers: Record<string, string> = { ...options.headers }
	let body: BodyInit | undefined

	if (options.body instanceof URLSearchParams) {
		body = options.body
	}
	else if (options.body !== undefined) {
		body = JSON.stringify(options.body)
		if (!Object.keys(headers).some(name => name.toLowerCase() === 'content-type')) {
			headers['Content-Type'] = 'application/json'
		}
	}

	const res = await fetch(url, { method: options.method || 'GET', headers, body })
	const text = await res.text()

	let data: any = text
	try {
		data = text ? JSON.parse(text) : undefined
	}
	catch {
		// Not JSON: keep the raw text
	}

	if (!res.ok) {
		const message = data?.error?.message || data?.error_description || res.statusText || `Request failed with status ${res.status}`
		throw Object.assign(new Error(message), { status: res.status, statusText: res.statusText, data })
	}

	return data as T
}
