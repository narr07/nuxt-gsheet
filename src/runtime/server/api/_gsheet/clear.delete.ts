import { defineEventHandler, readBody, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { getAccessToken } from '../../utils/auth'
import { incrementRequests, incrementQuotaUsage } from '../../utils/metrics'

export default defineEventHandler(async (event) => {
	incrementRequests()

	const body = await readBody(event)
	if (!body) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Request body is required',
			data: { errorCode: 'NOT_FOUND' }
		})
	}

	const sheet = body.sheet ? String(body.sheet) : undefined
	const range = body.range ? String(body.range) : undefined

	if (!range) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Range coordinate is required for clear operation',
			data: { errorCode: 'NOT_FOUND' }
		})
	}

	const config = useRuntimeConfig().gsheet || {}
	const clientEmail = config.credentials?.clientEmail || process.env.GSHEET_CLIENT_EMAIL
	const privateKey = config.credentials?.privateKey || process.env.GSHEET_PRIVATE_KEY
	const spreadsheetId = config.spreadsheetId || process.env.GSHEET_SPREADSHEET_ID
	const appscriptUrl = config.appscriptUrl || process.env.GSHEET_APPSCRIPT_URL

	// Resolve mode
	let resolvedMode = config.auth
	if (!resolvedMode) {
		if (appscriptUrl) {
			resolvedMode = 'appscript'
		}
		else if (clientEmail && privateKey) {
			resolvedMode = 'service-account'
		}
		else {
			throw createError({
				statusCode: 400,
				statusMessage: 'Write operations are not supported in read-only auth modes.',
				data: { errorCode: 'UNAUTHORIZED' }
			})
		}
	}

	let targetSpreadsheetId = spreadsheetId
	let targetAppscriptUrl = appscriptUrl

	if (sheet && config.sheets && config.sheets[sheet]) {
		const mapping = config.sheets[sheet]
		const mappingStr = String(mapping)
		if (mappingStr.startsWith('http')) {
			targetAppscriptUrl = mappingStr
		}
		else {
			targetSpreadsheetId = mappingStr
		}
	}

	try {
		if (resolvedMode === 'appscript') {
			if (!targetAppscriptUrl) {
				throw new Error('Apps Script Web App URL is missing.')
			}
			const res = await $fetch<any>(targetAppscriptUrl, {
				method: 'POST',
				body: {
					action: 'clear',
					sheet,
					range
				}
			})
			if (!res || !res.success) {
				throw new Error(res?.error || 'Apps Script returned success: false')
			}
			incrementQuotaUsage(1)
			return { success: true }
		}
		else if (resolvedMode === 'service-account') {
			if (!targetSpreadsheetId) {
				throw new Error('Spreadsheet ID is missing.')
			}
			if (!clientEmail || !privateKey) {
				throw new Error('Service Account credentials are missing.')
			}

			const accessToken = await getAccessToken(clientEmail, privateKey)
			const targetRange = sheet ? `${sheet}!${range}` : range
			const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${targetSpreadsheetId}/values/${encodeURIComponent(targetRange)}:clear`)

			const res = await $fetch<any>(url.toString(), {
				method: 'POST', // The Google API clear endpoint uses POST
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				}
			})

			incrementQuotaUsage(1)
			return { success: true, clearedRange: res.clearedRange }
		}
		else {
			throw new Error(`Write actions are not supported for mode: ${resolvedMode}`)
		}
	}
	catch (err: any) {
		console.error(`[nuxt-gsheet] Clear Error (${resolvedMode}):`, err.message || err)
		throw createError({
			statusCode: err.statusCode || 500,
			statusMessage: `Clear failed: ${err.message || String(err)}`,
			data: { errorCode: 'NETWORK_ERROR' }
		})
	}
})
