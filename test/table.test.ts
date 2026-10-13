import { describe, it, expect } from 'vitest'
import { buildTable } from '../src/runtime/utils/table'

const rows = [
	['Name', 'Price', 'Stock'],
	['Kopi', 18000, 12],
	['Teh', 9000, null]
]

describe('buildTable', () => {
	it('uses the first row as headers and stringifies cells', () => {
		expect(buildTable(rows)).toEqual({
			headers: ['Name', 'Price', 'Stock'],
			rows: [
				['Kopi', '18000', '12'],
				['Teh', '9000', '']
			]
		})
	})

	it('selects and orders columns by header name, ignoring case and unknown names', () => {
		expect(buildTable(rows, { columns: 'price, name, missing' })).toEqual({
			headers: ['Price', 'Name'],
			rows: [
				['18000', 'Kopi'],
				['9000', 'Teh']
			]
		})
		expect(buildTable(rows, { columns: ['Stock'] }).headers).toEqual(['Stock'])
	})

	it('caps body rows with limit and ignores invalid limits', () => {
		expect(buildTable(rows, { limit: '1' }).rows).toEqual([['Kopi', '18000', '12']])
		expect(buildTable(rows, { limit: 0 }).rows).toHaveLength(2)
		expect(buildTable(rows, { limit: 'abc' }).rows).toHaveLength(2)
	})

	it('skips body rows with offset, alone or combined with limit', () => {
		expect(buildTable(rows, { offset: 1 }).rows).toEqual([['Teh', '9000', '']])
		expect(buildTable(rows, { offset: '1', limit: 1 }).rows).toEqual([['Teh', '9000', '']])
		expect(buildTable(rows, { offset: 5 }).rows).toEqual([])
		expect(buildTable(rows, { offset: -2 }).rows).toHaveLength(2)
	})

	it('pads short rows and returns an empty table for unusable input', () => {
		expect(buildTable([['A', 'B'], ['1']]).rows).toEqual([['1', '']])
		expect(buildTable(null)).toEqual({ headers: [], rows: [] })
		expect(buildTable([])).toEqual({ headers: [], rows: [] })
	})
})
