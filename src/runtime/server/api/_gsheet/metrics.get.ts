import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'
import { metrics } from '../../utils/metrics'

export default defineEventHandler(() => {
	const config = useRuntimeConfig().gsheet || {}

	// Expose configuration metadata safely (never leak raw credentials or API keys)
	const safeConfig = {
		auth: config.auth || 'auto',
		spreadsheetId: config.spreadsheetId || 'not configured',
		appscriptUrl: config.appscriptUrl || 'not configured',
		hasApiKey: !!(config.apiKey || process.env.GSHEET_API_KEY),
		hasCredentials: !!((config.credentials?.clientEmail && config.credentials?.privateKey) || (process.env.GSHEET_CLIENT_EMAIL && process.env.GSHEET_PRIVATE_KEY)),
		sheets: config.sheets ? Object.keys(config.sheets) : [],
		cache: {
			enabled: config.cache?.enabled !== false,
			maxAge: config.cache?.maxAge || 300,
			storage: config.cache?.storage || 'memory'
		}
	}

	return {
		metrics,
		config: safeConfig
	}
})
