export interface GSheetMetrics {
	totalRequests: number
	cacheHits: number
	cacheMisses: number
	quotaUsageEst: number
}

// Global metrics object stored in-memory
export const metrics: GSheetMetrics = {
	totalRequests: 0,
	cacheHits: 0,
	cacheMisses: 0,
	quotaUsageEst: 0
}

export function incrementRequests() {
	metrics.totalRequests++
}

export function incrementCacheHits() {
	metrics.cacheHits++
}

export function incrementCacheMisses() {
	metrics.cacheMisses++
}

export function incrementQuotaUsage(amount = 1) {
	metrics.quotaUsageEst += amount
}
