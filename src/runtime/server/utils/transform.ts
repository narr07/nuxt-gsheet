/**
 * Convert a standard grid of rows (first row is header) to an array of objects
 */
export function rowsToObjects(rows: any[][]): any[] {
	if (!Array.isArray(rows) || rows.length < 2) return []
	const [headers, ...dataRows] = rows
	return dataRows.map((row) => {
		const obj: any = {}
		headers.forEach((header, idx) => {
			if (header !== undefined && header !== null) {
				const key = String(header).trim()
				if (key) {
					obj[key] = row[idx] !== undefined ? row[idx] : null
				}
			}
		})
		return obj
	})
}

/**
 * Parses raw CSV content into array of rows or array of objects
 */
export function parseCsv(csvText: string, asObject: boolean = false): any[] {
	const lines: string[][] = []
	let row: string[] = []
	let inQuotes = false
	let currentVal = ''

	for (let i = 0; i < csvText.length; i++) {
		const char = csvText[i]
		const nextChar = csvText[i + 1]

		if (char === '"') {
			if (inQuotes && nextChar === '"') {
				currentVal += '"'
				i++ // skip next quote
			}
			else {
				inQuotes = !inQuotes
			}
		}
		else if (char === ',' && !inQuotes) {
			row.push(currentVal)
			currentVal = ''
		}
		else if ((char === '\r' || char === '\n') && !inQuotes) {
			if (char === '\r' && nextChar === '\n') {
				i++
			}
			row.push(currentVal)
			lines.push(row)
			row = []
			currentVal = ''
		}
		else {
			currentVal += char
		}
	}
	if (currentVal || row.length > 0) {
		row.push(currentVal)
		lines.push(row)
	}

	const parsedRows = lines.filter(r => r.length > 0 && r.some(cell => cell.trim() !== ''))

	if (asObject) {
		return rowsToObjects(parsedRows)
	}
	return parsedRows
}

/**
 * Parses Google Visualization (GViz) JSON response format
 */
export function parseGvizResponse(json: any, asObject: boolean = false): any[] {
	if (!json || !json.table) return []
	const cols = json.table.cols || []
	const rows = json.table.rows || []

	const parsedRows = rows.map((r: any) => {
		if (!r || !r.c) return []
		return r.c.map((cell: any) => {
			if (!cell) return null
			return cell.v !== undefined ? cell.v : null
		})
	})

	if (asObject) {
		const headers = cols.map((col: any, idx: number) => {
			const label = col.label ? String(col.label).trim() : ''
			return label || col.id || `col_${idx}`
		})
		return parsedRows.map((row: any) => {
			const obj: any = {}
			headers.forEach((header: string, idx: number) => {
				obj[header] = row[idx] !== undefined ? row[idx] : null
			})
			return obj
		})
	}

	return parsedRows
}
