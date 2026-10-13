import { defineEventHandler } from 'nuxt/server'
import { renderDevtoolsPage } from '../../handlers/devtools'

// A string would be sent as JSON here, so respond with an explicit HTML document
export default defineEventHandler(() => new Response(renderDevtoolsPage(), {
	headers: { 'content-type': 'text/html; charset=utf-8' }
}))
