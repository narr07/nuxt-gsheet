import { useGSheet } from './useGSheet'
import type { ComposablesOptions } from '../../types'

interface ExtendedComposablesOptions extends ComposablesOptions {
	key?: string
}

export function useGSheetRow<T = any>(range: string, rowIndex: number, options: ExtendedComposablesOptions = {}) {
	return useGSheet<T>(range, {
		...options,
		key: options.key || `gsheet_row:${rowIndex}:${range}`,
		transform: (rows: any) => {
			const row = Array.isArray(rows) ? (rows[rowIndex] || null) : null
			return options.transform ? options.transform(row) : row
		}
	})
}
