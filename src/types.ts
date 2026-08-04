export interface GSheetCredentials {
	clientEmail: string
	privateKey: string
}

export interface GSheetCacheOptions {
	enabled?: boolean
	maxAge?: number // cache TTL in seconds (default is 300)
	storage?: 'memory' | string // storage driver
}

export interface ModuleOptions {
	/**
	 * Mode of authentication / fetching:
	 * - 'apikey': Google Sheets API v4 using an API Key
	 * - 'service-account': Google Sheets API v4 using a Service Account
	 * - 'appscript': Custom Google Apps Script Web App doGet/doPost URL
	 * - 'gviz': Google Visualization endpoint (no API keys, public only)
	 * - 'csv': Direct CSV export parsing (no API keys, public only)
	 * - 'oauth2': Logged-in user context OAuth2 (optional)
	 */
	auth?: 'apikey' | 'service-account' | 'appscript' | 'gviz' | 'csv' | 'oauth2'

	/**
	 * Google Sheets API v4 Key (for public sheets)
	 */
	apiKey?: string

	/**
	 * Default Google Spreadsheet ID
	 */
	spreadsheetId?: string

	/**
	 * Custom Apps Script Web App deployment URL
	 */
	appscriptUrl?: string

	/**
	 * Google Service Account credentials (for private sheets)
	 */
	credentials?: GSheetCredentials

	/**
	 * Sheet routing map. Maps a dynamic key (e.g. 'products') to:
	 * - A Spreadsheet ID (for standard/gviz/csv modes)
	 * - An Apps Script Web App URL (for appscript mode)
	 * - A GID (for csv sheet indexing)
	 */
	sheets?: Record<string, string | number>

	/**
	 * Response caching settings
	 */
	cache?: GSheetCacheOptions
}

export interface GSheetWriteOptions {
	sheet?: string
	range?: string
	values?: any[][]
	row?: any[]
}

export interface ComposablesOptions {
	sheet?: string
	valueRenderOption?: 'FORMATTED_VALUE' | 'UNFORMATTED_VALUE' | 'FORMULA'
	transform?: (data: any) => any
	cache?: boolean
	cacheMaxAge?: number
	query?: string
}
