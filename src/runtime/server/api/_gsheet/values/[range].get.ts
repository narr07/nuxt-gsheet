import { defineEventHandler, getRouterParam, getQuery, createError, setHeaders } from 'h3'
import { useRuntimeConfig } from '#imports'
import { getAccessToken } from '../../../utils/auth'
import { getCacheStorage } from '../../../utils/cache'
import { parseCsv, parseGvizResponse } from '../../../utils/transform'
import { incrementRequests, incrementCacheHits, incrementCacheMisses, incrementQuotaUsage } from '../../../utils/metrics'

export default defineEventHandler(async (event) => {
	incrementRequests()

	const range = getRouterParam(event, 'range')
	if (!range) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Range parameter is required',
			data: { errorCode: 'NOT_FOUND' }
		})
	}

	const query = getQuery(event)
	const sheet = query.sheet ? String(query.sheet) : undefined
	const valueRenderOption = query.valueRenderOption ? String(query.valueRenderOption) : undefined
	const bypassCache = query.bypassCache === 'true'
	const cacheMaxAge = query.cacheMaxAge ? Number(query.cacheMaxAge) : undefined
	const gvizQuery = query.query ? String(query.query) : undefined

	// Retrieve configurations
	const config = useRuntimeConfig().gsheet || {}
	const apiKey = config.apiKey || process.env.GSHEET_API_KEY
	const clientEmail = config.credentials?.clientEmail || process.env.GSHEET_CLIENT_EMAIL
	const privateKey = config.credentials?.privateKey || process.env.GSHEET_PRIVATE_KEY
	const spreadsheetId = config.spreadsheetId || process.env.GSHEET_SPREADSHEET_ID
	const appscriptUrl = config.appscriptUrl || process.env.GSHEET_APPSCRIPT_URL

	// Resolve the active authentication / read mode
	let resolvedMode = config.auth
	if (!resolvedMode) {
		if (appscriptUrl) {
			resolvedMode = 'appscript'
		} else if (apiKey) {
			resolvedMode = 'apikey'
		} else if (clientEmail && privateKey) {
			resolvedMode = 'service-account'
		} else if (spreadsheetId) {
			resolvedMode = 'gviz'
		} else {
			resolvedMode = 'gviz' // fallback
		}
	}

	// Resolve the sheet target spreadsheet ID, Apps Script URL, or CSV GID mapping
	let targetSpreadsheetId = spreadsheetId
	let targetAppscriptUrl = appscriptUrl
	let targetGid: string | number | undefined

	if (sheet && config.sheets && config.sheets[sheet]) {
		const mapping = config.sheets[sheet]
		const mappingStr = String(mapping)
		if (mappingStr.startsWith('http')) {
			targetAppscriptUrl = mappingStr
		} else if (resolvedMode === 'csv') {
			targetGid = mapping
		} else {
			targetSpreadsheetId = mappingStr
		}
	}

	// Resolve cache storage and check cache
	const cacheStorage = getCacheStorage(config)
	const cacheKey = `${resolvedMode}:${targetSpreadsheetId || 'no-id'}:${sheet || 'default'}:${range}:${valueRenderOption || 'default'}:${gvizQuery || 'no-query'}`
	const lockKey = `lock:${cacheKey}`
	const lockTtl = 30 // 30 seconds

	// Read existing cached entry
	const cachedEntry: any = config.cache?.enabled !== false ? await cacheStorage.getItem(cacheKey) : null
	const ttl = cacheMaxAge !== undefined ? cacheMaxAge : (config.cache?.maxAge || 300)

	if (cachedEntry && !bypassCache) {
		const { data, expiresAt, timestamp } = cachedEntry
		const cacheAge = Date.now() - timestamp
		const isExpired = Date.now() > expiresAt

		if (!isExpired) {
			incrementCacheHits()
			setHeaders(event, {
				'Access-Control-Allow-Origin': '*',
				'X-Cache': 'HIT',
				'X-Cache-Age': Math.round(cacheAge / 1000).toString(),
				'X-Cache-Expires': Math.round((expiresAt - Date.now()) / 1000).toString()
			})
			return data
		}

		// Cache is expired, check if another request is already fetching to prevent dogpile stampede
		const isLocked = await cacheStorage.getItem(lockKey)
		if (isLocked) {
			console.log(`[nuxt-gsheet] Serving stale data for key: ${cacheKey} (fetch lock active)`)
			incrementCacheHits()
			setHeaders(event, {
				'Access-Control-Allow-Origin': '*',
				'X-Cache': 'STALE',
				'X-Cache-Age': Math.round(cacheAge / 1000).toString()
			})
			return data
		}
	}

	// First request concurrency lock check (no cache exists, but lock is active)
	if (!cachedEntry && !bypassCache && config.cache?.enabled !== false) {
		const isLocked = await cacheStorage.getItem(lockKey)
		if (isLocked) {
			// Wait 500ms and retry getting from cache
			await new Promise(resolve => setTimeout(resolve, 500))
			const retriedEntry: any = await cacheStorage.getItem(cacheKey)
			if (retriedEntry) {
				setHeaders(event, {
					'Access-Control-Allow-Origin': '*',
					'X-Cache': 'HIT-RETRY'
				})
				return retriedEntry.data
			}
		}
	}

	// Set fetch lock to prevent dogpile stampede
	if (config.cache?.enabled !== false) {
		await cacheStorage.setItem(lockKey, Date.now(), { ttl: lockTtl })
	}

	incrementCacheMisses()
	let fetchedData: any = null

	try {
		if (resolvedMode === 'appscript') {
			if (!targetAppscriptUrl) {
				throw createError({
					statusCode: 400,
					statusMessage: 'Apps Script Web App URL is missing. Check gsheet.appscriptUrl config.',
					data: { errorCode: 'UNAUTHORIZED' }
				})
			}
			const url = new URL(targetAppscriptUrl)
			if (sheet) url.searchParams.set('sheet', sheet)
			url.searchParams.set('range', range)
			url.searchParams.set('asObject', 'false')

			const res = await $fetch<any>(url.toString())
			if (!res || res.error) {
				throw new Error(res?.error || 'Apps Script returned an empty/error response')
			}
			fetchedData = res.data
			incrementQuotaUsage(1)
		} else if (resolvedMode === 'csv') {
			if (!targetSpreadsheetId) {
				throw createError({
					statusCode: 400,
					statusMessage: 'Spreadsheet ID is missing. Check gsheet.spreadsheetId config.',
					data: { errorCode: 'UNAUTHORIZED' }
				})
			}
			const url = new URL(`https://docs.google.com/spreadsheets/d/${targetSpreadsheetId}/export`)
			url.searchParams.set('format', 'csv')
			if (targetGid !== undefined) {
				url.searchParams.set('gid', String(targetGid))
			}

			const res = await fetch(url.toString())
			const csvText = await res.text()
			fetchedData = parseCsv(csvText)
			incrementQuotaUsage(1)
		} else if (resolvedMode === 'gviz') {
			if (!targetSpreadsheetId) {
				throw createError({
					statusCode: 400,
					statusMessage: 'Spreadsheet ID is missing. Check gsheet.spreadsheetId config.',
					data: { errorCode: 'UNAUTHORIZED' }
				})
			}
			const url = new URL(`https://docs.google.com/spreadsheets/d/${targetSpreadsheetId}/gviz/tq`)
			url.searchParams.set('tqx', 'out:json')
			if (sheet) url.searchParams.set('sheet', sheet)
			if (gvizQuery) url.searchParams.set('tq', gvizQuery)

			const res = await fetch(url.toString())
			const text = await res.text()
			const start = text.indexOf('(')
			const end = text.lastIndexOf(')')
			if (start === -1 || end === -1) {
				throw new Error('Invalid GViz wrapper response received')
			}
			const json = JSON.parse(text.substring(start + 1, end))
			if (json.status === 'error') {
				const detailedMsg = json.errors?.[0]?.detailed_message || 'GViz API returned error'
				throw new Error(detailedMsg)
			}
			fetchedData = parseGvizResponse(json)
			incrementQuotaUsage(1)
		} else if (resolvedMode === 'apikey') {
			if (!targetSpreadsheetId) {
				throw createError({
					statusCode: 400,
					statusMessage: 'Spreadsheet ID is missing. Check gsheet.spreadsheetId config.',
					data: { errorCode: 'UNAUTHORIZED' }
				})
			}
			if (!apiKey) {
				throw createError({
					statusCode: 400,
					statusMessage: 'Google API Key is missing. Check gsheet.apiKey config.',
					data: { errorCode: 'UNAUTHORIZED' }
				})
			}
			const fullRange = sheet ? `${sheet}!${range}` : range
			const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${targetSpreadsheetId}/values/${encodeURIComponent(fullRange)}`)
			url.searchParams.set('key', apiKey)
			if (valueRenderOption) {
				url.searchParams.set('valueRenderOption', valueRenderOption)
			}

			const res = await $fetch<any>(url.toString())
			fetchedData = res.values || []
			incrementQuotaUsage(1)
		} else if (resolvedMode === 'service-account') {
			if (!targetSpreadsheetId) {
				throw createError({
					statusCode: 400,
					statusMessage: 'Spreadsheet ID is missing. Check gsheet.spreadsheetId config.',
					data: { errorCode: 'UNAUTHORIZED' }
				})
			}
			if (!clientEmail || !privateKey) {
				throw createError({
					statusCode: 400,
					statusMessage: 'Service Account email or private key is missing from credentials.',
					data: { errorCode: 'UNAUTHORIZED' }
				})
			}

			const accessToken = await getAccessToken(clientEmail, privateKey)
			const fullRange = sheet ? `${sheet}!${range}` : range
			const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${targetSpreadsheetId}/values/${encodeURIComponent(fullRange)}`)
			if (valueRenderOption) {
				url.searchParams.set('valueRenderOption', valueRenderOption)
			}

			const res = await $fetch<any>(url.toString(), {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			})
			fetchedData = res.values || []
			incrementQuotaUsage(1)
		} else {
			throw createError({
				statusCode: 400,
				statusMessage: `Unsupported or invalid authentication mode: ${resolvedMode}`,
				data: { errorCode: 'UNAUTHORIZED' }
			})
		}

		// Store in cache
		if (config.cache?.enabled !== false) {
			await cacheStorage.setItem(cacheKey, {
				data: fetchedData,
				timestamp: Date.now(),
				expiresAt: Date.now() + ttl * 1000
			})
			await cacheStorage.removeItem(lockKey)
		}

		setHeaders(event, {
			'Access-Control-Allow-Origin': '*',
			'X-Cache': 'MISS',
			'X-Cache-Updated': new Date().toISOString(),
			'X-Cache-Expires': ttl.toString()
		})

		return fetchedData
	} catch (err: any) {
		// Clean lock on error
		if (config.cache?.enabled !== false) {
			await cacheStorage.removeItem(lockKey).catch(() => {})
		}

		// Stale-on-error recovery: Serve expired cache if it exists, rather than throwing
		if (cachedEntry) {
			console.warn(`[nuxt-gsheet] Serving stale data due to fetch error for key ${cacheKey}:`, err.message || err)
			setHeaders(event, {
				'Access-Control-Allow-Origin': '*',
				'X-Cache': 'STALE-ERROR',
				'X-Cache-Error': err.message || 'Fetch failed',
				'X-Cache-Age': Math.round((Date.now() - cachedEntry.timestamp) / 1000).toString()
			})
			return cachedEntry.data
		}

		const statusCode = err.statusCode || 500
		const statusMessage = err.statusMessage || err.message || String(err)
		
		console.error(`[nuxt-gsheet] API Error (${resolvedMode}):`, statusMessage)
		if (statusCode === 403 || statusMessage.includes('permission') || statusMessage.includes('accessor')) {
			console.warn('[nuxt-gsheet] Access unauthorized. Make sure the spreadsheet is set to "Anyone with link can view" or shared with your Service Account email.')
			throw createError({
				statusCode: 403,
				statusMessage: 'Access unauthorized: Spreadsheet is private or public access is disabled.',
				data: { errorCode: 'UNAUTHORIZED' }
			})
		} else if (statusCode === 404 || statusMessage.includes('not found') || statusMessage.includes('range')) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Sheet or range not found. Verify spreadsheetId, sheet name, and cell range coordinates.',
				data: { errorCode: 'NOT_FOUND' }
			})
		} else if (statusCode === 429 || statusMessage.includes('quota')) {
			throw createError({
				statusCode: 429,
				statusMessage: 'Google Sheets API quota exceeded.',
				data: { errorCode: 'QUOTA_EXCEEDED' }
			})
		}
		
		throw createError({
			statusCode,
			statusMessage: `Fetching error: ${statusMessage}`,
			data: { errorCode: 'NETWORK_ERROR' }
		})
	}
})
