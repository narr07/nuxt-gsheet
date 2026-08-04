export default defineNuxtConfig({
	modules: [
		'../src/module'
	],
	devtools: { enabled: true },
	compatibilityDate: 'latest',

	// Configure Google Sheets module options using environment variables
	gsheet: {
		auth: 'appscript',
		// Automatically loaded from .env on the server side
		appscriptUrl: process.env.GSHEET_APPSCRIPT_URL,
		cache: {
			enabled: true,
			maxAge: 300 // 5 minutes
		}
	}
})
