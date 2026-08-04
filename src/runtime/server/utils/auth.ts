let subtle: any = globalThis.crypto?.subtle

function pemToDer(pem: string): ArrayBuffer {
	// Normalize newlines and remove PEM boundary headers and footers
	const cleanPem = pem
		.replace(/\\n/g, '\n')
		.replace('-----BEGIN PRIVATE KEY-----', '')
		.replace('-----END PRIVATE KEY-----', '')
		.replace(/\s+/g, '')

	const binary = atob(cleanPem)
	const len = binary.length
	const bytes = new Uint8Array(len)
	for (let i = 0; i < len; i++) {
		bytes[i] = binary.charCodeAt(i)
	}
	return bytes.buffer
}

async function getSubtle() {
	if (subtle) return subtle
	try {
		const { webcrypto } = await import('node:crypto')
		subtle = webcrypto.subtle
	} catch {}
	return subtle
}

function base64url(arr: Uint8Array): string {
	let binary = ''
	for (let i = 0; i < arr.byteLength; i++) {
		binary += String.fromCharCode(arr[i])
	}
	return btoa(binary)
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
}

export async function signJwt(clientEmail: string, privateKeyPem: string): Promise<string> {
	const header = { alg: 'RS256', typ: 'JWT' }
	const now = Math.floor(Date.now() / 1000)
	const payload = {
		iss: clientEmail,
		scope: 'https://www.googleapis.com/auth/spreadsheets',
		aud: 'https://oauth2.googleapis.com/token',
		exp: now + 3600,
		iat: now
	}

	const encoder = new TextEncoder()
	const headerStr = base64url(encoder.encode(JSON.stringify(header)))
	const payloadStr = base64url(encoder.encode(JSON.stringify(payload)))
	const dataToSign = encoder.encode(`${headerStr}.${payloadStr}`)

	const cryptoSubtle = await getSubtle()
	if (!cryptoSubtle) {
		throw new Error('Web Cryptography API (crypto.subtle) is not supported in this runtime environment.')
	}

	const der = pemToDer(privateKeyPem)
	const key = await cryptoSubtle.importKey(
		'pkcs8',
		der,
		{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
		false,
		['sign']
	)

	const signature = await cryptoSubtle.sign(
		'RSASSA-PKCS1-v1_5',
		key,
		dataToSign
	)

	const signatureStr = base64url(new Uint8Array(signature))
	return `${headerStr}.${payloadStr}.${signatureStr}`
}

// In-memory token cache to minimize authentication requests
let cachedToken: string | null = null
let tokenExpiry = 0

export async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
	const now = Date.now()
	if (cachedToken && tokenExpiry > now) {
		return cachedToken
	}

	const assertion = await signJwt(clientEmail, privateKey)

	const response = await $fetch<any>('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			assertion
		})
	})

	if (!response || !response.access_token) {
		throw new Error('Failed to retrieve access token from Google: ' + JSON.stringify(response))
	}

	cachedToken = response.access_token
	// Expire 1 minute early to guarantee valid requests
	tokenExpiry = now + (response.expires_in - 60) * 1000

	return cachedToken!
}
