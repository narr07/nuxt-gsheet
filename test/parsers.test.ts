import { describe, it, expect } from 'vitest'
import { parseCsv, parseGvizResponse, rowsToObjects } from '../src/runtime/server/utils/transform'

describe('CSV Parser', () => {
	it('parses standard CSV data into rows', () => {
		const csvText = 'Name,Age,Role\nBudi,25,Developer\nAni,22,Designer'
		const rows = parseCsv(csvText)
		expect(rows).toEqual([
			['Name', 'Age', 'Role'],
			['Budi', '25', 'Developer'],
			['Ani', '22', 'Designer']
		])
	})

	it('parses CSV data with quoted fields', () => {
		const csvText = 'Product,Price,Description\nLaptop,"15000000","High end, gaming laptop"\nMouse,150000,"Regular mouse"'
		const rows = parseCsv(csvText)
		expect(rows).toEqual([
			['Product', 'Price', 'Description'],
			['Laptop', '15000000', 'High end, gaming laptop'],
			['Mouse', '150000', 'Regular mouse']
		])
	})

	it('parses CSV data to objects when asObject is true', () => {
		const csvText = 'Name,Age,Role\nBudi,25,Developer\nAni,22,Designer'
		const objects = parseCsv(csvText, true)
		expect(objects).toEqual([
			{ Name: 'Budi', Age: '25', Role: 'Developer' },
			{ Name: 'Ani', Age: '22', Role: 'Designer' }
		])
	})
})

describe('Rows to Objects Converter', () => {
	it('converts matrix rows to array of objects using headers', () => {
		const rows = [
			['Id', 'Title', 'Active'],
			['1', 'Task A', 'true'],
			['2', 'Task B', 'false']
		]
		const objects = rowsToObjects(rows)
		expect(objects).toEqual([
			{ Id: '1', Title: 'Task A', Active: 'true' },
			{ Id: '2', Title: 'Task B', Active: 'false' }
		])
	})

	it('returns empty array if rows has less than 2 rows', () => {
		expect(rowsToObjects([['Id', 'Title']])).toEqual([])
		expect(rowsToObjects([])).toEqual([])
	})
})

describe('GViz Parser', () => {
	it('parses Google Visualization JSON table representation', () => {
		const mockGvizJson = {
			table: {
				cols: [
					{ id: 'A', label: 'ID', type: 'string' },
					{ id: 'B', label: 'Name', type: 'string' }
				],
				rows: [
					{ c: [{ v: '1' }, { v: 'Budi' }] },
					{ c: [{ v: '2' }, { v: 'Ani' }] }
				]
			}
		}

		const rows = parseGvizResponse(mockGvizJson)
		expect(rows).toEqual([
			['1', 'Budi'],
			['2', 'Ani']
		])

		const objects = parseGvizResponse(mockGvizJson, true)
		expect(objects).toEqual([
			{ ID: '1', Name: 'Budi' },
			{ ID: '2', Name: 'Ani' }
		])
	})

	it('falls back to column letters if labels are missing', () => {
		const mockGvizJson = {
			table: {
				cols: [
					{ id: 'A', label: '', type: 'string' },
					{ id: 'B', label: '', type: 'string' }
				],
				rows: [
					{ c: [{ v: '1' }, { v: 'Budi' }] }
				]
			}
		}

		const objects = parseGvizResponse(mockGvizJson, true)
		expect(objects).toEqual([
			{ A: '1', B: 'Budi' }
		])
	})
})
