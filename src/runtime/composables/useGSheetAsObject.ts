import { useGSheet } from './useGSheet'
import type { ComposablesOptions } from '../../types'

interface ExtendedComposablesOptions extends ComposablesOptions {
	key?: string
}

export function useGSheetAsObject<T = any[]>(range: string, options: ExtendedComposablesOptions = {}) {
	return useGSheet<T>(range, {
		...options,
		key: options.key || `gsheet_object:${range}`,
		transform: (rows: any) => {
			if (!Array.isArray(rows) || rows.length < 2) return []
			const [headers, ...dataRows] = rows
			const parsed = dataRows.map((row: any) => {
				const obj: any = {}
				headers.forEach((header: any, idx: number) => {
					if (header !== undefined && header !== null) {
						const key = String(header).trim()
						if (key) {
							obj[key] = row[idx] !== undefined ? row[idx] : null
						}
					}
				})
				return obj
			})
			return options.transform ? options.transform(parsed) : parsed
		}
	})
}
