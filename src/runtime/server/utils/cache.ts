import { createStorage } from 'unstorage'
import memoryDriver from 'unstorage/drivers/memory'

let storage: any = null

export function getCacheStorage(config: any) {
	if (storage) return storage

	// If cache is enabled, we check if global useStorage from Nitro is available
	if (config.cache?.enabled !== false) {
		try {
			storage = (globalThis as any).useStorage?.('gsheet') || (globalThis as any).useStorage?.() || createStorage({
				driver: memoryDriver()
			})
		}
		catch {
			storage = createStorage({
				driver: memoryDriver()
			})
		}
	}
	else {
		// Mock storage or memory driver when cache is disabled
		storage = createStorage({
			driver: memoryDriver()
		})
	}
	return storage
}
