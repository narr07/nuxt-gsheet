import type { GSheetWriteOptions } from '../../types'

export function useGSheetWrite(globalOptions: { sheet?: string } = {}) {
	const append = async (arg1: string | GSheetWriteOptions, arg2?: any[][]) => {
		let body: any = {}
		if (typeof arg1 === 'string') {
			body = {
				range: arg1,
				values: arg2,
				sheet: globalOptions.sheet
			}
		} else {
			body = { ...arg1 }
			if (globalOptions.sheet && !body.sheet) {
				body.sheet = globalOptions.sheet
			}
		}
		return $fetch<any>('/api/_gsheet/append', {
			method: 'POST',
			body
		})
	}

	const update = async (arg1: string | GSheetWriteOptions, arg2?: any[][]) => {
		let body: any = {}
		if (typeof arg1 === 'string') {
			body = {
				range: arg1,
				values: arg2,
				sheet: globalOptions.sheet
			}
		} else {
			body = { ...arg1 }
			if (globalOptions.sheet && !body.sheet) {
				body.sheet = globalOptions.sheet
			}
		}
		return $fetch<any>('/api/_gsheet/update', {
			method: 'PUT',
			body
		})
	}

	const clear = async (arg1: string | GSheetWriteOptions) => {
		let body: any = {}
		if (typeof arg1 === 'string') {
			body = {
				range: arg1,
				sheet: globalOptions.sheet
			}
		} else {
			body = { ...arg1 }
			if (globalOptions.sheet && !body.sheet) {
				body.sheet = globalOptions.sheet
			}
		}
		return $fetch<any>('/api/_gsheet/clear', {
			method: 'DELETE',
			body
		})
	}

	return { append, update, clear }
}
