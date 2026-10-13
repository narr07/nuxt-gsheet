export interface GSheetTableOptions {
	columns?: string | string[]
	limit?: number | string
	offset?: number | string
}

export interface GSheetTableData {
	headers: string[]
	rows: string[][]
}

const toCell = (value: unknown): string => (value === undefined || value === null ? '' : String(value))

/**
 * Shapes raw sheet rows (first row = headers) into table headers and body rows.
 * `columns` selects and orders columns by header name, `offset` skips body rows
 * and `limit` caps how many are kept.
 */
export function buildTable(raw: unknown, options: GSheetTableOptions = {}): GSheetTableData {
	if (!Array.isArray(raw) || raw.length === 0 || !Array.isArray(raw[0])) {
		return { headers: [], rows: [] }
	}

	const headerRow = raw[0] as unknown[]
	const dataRows = raw.slice(1) as unknown[][]
	const allHeaders = headerRow.map(header => toCell(header).trim())

	const wanted = (Array.isArray(options.columns) ? options.columns : String(options.columns ?? '').split(','))
		.map(name => String(name).trim())
		.filter(Boolean)

	// Column lookup is case-insensitive; names that match no header are skipped
	let indexes = allHeaders.map((_, idx) => idx)
	if (wanted.length > 0) {
		const lookup = allHeaders.map(header => header.toLowerCase())
		indexes = wanted
			.map(name => lookup.indexOf(name.toLowerCase()))
			.filter(idx => idx !== -1)
	}

	const offset = Number(options.offset)
	const start = Number.isFinite(offset) && offset > 0 ? Math.floor(offset) : 0
	const limit = Number(options.limit)
	const body = Number.isFinite(limit) && limit > 0
		? dataRows.slice(start, start + Math.floor(limit))
		: dataRows.slice(start)

	return {
		headers: indexes.map(idx => allHeaders[idx] as string),
		rows: body
			.filter(row => Array.isArray(row))
			.map(row => indexes.map(idx => toCell(row[idx])))
	}
}
