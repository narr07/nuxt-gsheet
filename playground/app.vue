<template>
	<div class="app-container">
		<header class="app-header">
			<div class="logo-area">
				<div class="logo-box">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3H19ZM19 7.5H14.5V5H19V7.5ZM13 5V7.5H8.5V5H13ZM5 5H7V7.5H5V5ZM5 9H7V11.5H5V9ZM5 13H7V15.5H5V13ZM5 17H7V19H5V17ZM8.5 19V17H13V19H8.5ZM14.5 19V17H19V19H14.5ZM19 15.5H14.5V13H19V15.5ZM13 13V15.5H8.5V13H13ZM8.5 11.5V9H13V11.5H8.5ZM14.5 11.5V9H19V11.5H14.5Z" fill="#10B981"/>
					</svg>
				</div>
				<div>
					<h1>Google Sheets Integration</h1>
					<p class="subtitle">Live Playgrounds & Component Diagnostics</p>
				</div>
			</div>
			<div class="actions">
				<button 
					@click="refreshData" 
					class="btn btn-primary"
					:class="{ loading: pending }"
					:disabled="pending"
				>
					<span class="btn-text">{{ pending ? 'Refreshing...' : 'Invalidate & Refresh' }}</span>
				</button>
			</div>
		</header>

		<main class="app-content">
			<!-- Error State -->
			<div v-if="error" class="card error-card">
				<div class="error-header">
					<span class="error-dot"></span>
					<h3>Data Acquisition Failed</h3>
				</div>
				<p class="error-msg">{{ error.message || error.statusMessage || error }}</p>
				<p class="error-hint">Verify your Google Sheets configurations or public sharing permissions in nuxt.config</p>
			</div>

			<!-- Dashboard Panels -->
			<div class="dashboard-grid">
				<!-- Panel 1: Objects -->
				<section class="card glass">
					<div class="card-header">
						<h2>Parsed Objects <span class="badge badge-success">useGSheetAsObject</span></h2>
					</div>
					<div class="scroll-table-container">
						<table v-if="objects && objects.length">
							<thead>
								<tr>
									<th v-for="header in Object.keys(objects[0])" :key="header">{{ header }}</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(row, idx) in objects" :key="idx">
									<td v-for="(val, key) in row" :key="key">{{ val }}</td>
								</tr>
							</tbody>
						</table>
						<div v-else-if="pending" class="loading-state">Fetching latest data...</div>
						<div v-else class="empty-state">No parsed objects found</div>
					</div>
				</section>

				<!-- Panel 2: Raw Grid -->
				<section class="card glass">
					<div class="card-header">
						<h2>Raw Data Grid <span class="badge badge-info">useGSheet</span></h2>
					</div>
					<div class="scroll-table-container">
						<table v-if="rawData && rawData.length">
							<tbody>
								<tr v-for="(row, idx) in rawData" :key="idx">
									<td 
										v-for="(val, cIdx) in row" 
										:key="cIdx"
										:class="{ 'header-cell': idx === 0 }"
									>
										{{ val }}
									</td>
								</tr>
							</tbody>
						</table>
						<div v-else-if="pending" class="loading-state">Fetching latest data...</div>
						<div v-else class="empty-state">No grid records loaded</div>
					</div>
				</section>
			</div>

			<!-- Panel 3: Single Row Extraction -->
			<section class="card glass header-row-section">
				<div class="card-header">
					<h2>Single Row Extraction <span class="badge badge-warning">useGSheetRow</span></h2>
				</div>
				<div class="row-extraction-body">
					<p class="desc">Fetched row index <code>0</code> (typically column header row):</p>
					<div v-if="headerRow && headerRow.length" class="tags-container">
						<template v-for="(col, index) in headerRow" :key="index">
							<span v-if="col !== null && col !== undefined && String(col).trim() !== ''" class="tag">
								<span class="tag-index">{{ index }}</span>
								<span class="tag-text">{{ col }}</span>
							</span>
						</template>
					</div>
					<div v-else-if="pending" class="loading-state">Loading rows...</div>
					<div v-else class="empty-state">No header row found</div>
				</div>
			</section>
		</main>
	</div>
</template>

<script setup>
// The following composables are automatically registered by the module and require no manual imports.
const { data: rawData, pending, error, refresh } = await useGSheet('Class Data!A1:F10')
const { data: objects } = await useGSheetAsObject('Class Data!A1:F10')
const { data: headerRow } = await useGSheetRow('Class Data!A1:F10', 0)

const refreshData = async () => {
	await refresh()
}
</script>

<style>
:root {
	--bg: #09090b;
	--card-bg: rgba(24, 24, 27, 0.6);
	--border: rgba(63, 63, 70, 0.4);
	--primary: #3b82f6;
	--primary-hover: #2563eb;
	--success: #10b981;
	--warning: #f59e0b;
	--info: #06b6d4;
	--text: #f4f4f5;
	--text-muted: #a1a1aa;
}

body {
	background-color: var(--bg);
	color: var(--text);
	margin: 0;
	padding: 0;
	font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
	background-image: 
		radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.08) 0px, transparent 50%),
		radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%);
	min-height: 100vh;
}

.app-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 40px 24px;
}

.app-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40px;
	border-bottom: 1px solid var(--border);
	padding-bottom: 24px;
}

.logo-area {
	display: flex;
	align-items: center;
	gap: 16px;
}

.logo-box {
	background: rgba(16, 185, 129, 0.15);
	border: 1px solid var(--success);
	width: 48px;
	height: 48px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
}

.app-header h1 {
	font-size: 22px;
	font-weight: 700;
	margin: 0;
}

.subtitle {
	color: var(--text-muted);
	font-size: 13px;
	margin-top: 4px;
}

.btn {
	background-color: var(--primary);
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
	display: inline-flex;
	align-items: center;
	box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.btn:hover:not(:disabled) {
	background-color: var(--primary-hover);
	transform: translateY(-1px);
}

.btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.dashboard-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
	gap: 28px;
	margin-bottom: 28px;
}

@media (max-width: 1100px) {
	.dashboard-grid {
		grid-template-columns: 1fr;
	}
}

.card {
	background: var(--card-bg);
	border: 1px solid var(--border);
	border-radius: 16px;
	padding: 24px;
	backdrop-filter: blur(8px);
	box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.card-header {
	border-bottom: 1px solid var(--border);
	padding-bottom: 16px;
	margin-bottom: 20px;
}

.card h2 {
	font-size: 16px;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.badge {
	font-size: 11px;
	font-weight: 600;
	padding: 3px 8px;
	border-radius: 6px;
	text-transform: uppercase;
	letter-spacing: 0.02em;
}

.badge-success { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
.badge-info { background: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3); }
.badge-warning { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }

.scroll-table-container {
	max-height: 380px;
	overflow-y: auto;
	border: 1px solid var(--border);
	border-radius: 10px;
	background: rgba(0, 0, 0, 0.2);
}

table {
	width: 100%;
	border-collapse: collapse;
	font-size: 13px;
}

th, td {
	padding: 12px 16px;
	text-align: left;
	border-bottom: 1px solid var(--border);
}

th {
	background: rgba(39, 39, 42, 0.6);
	color: var(--text-muted);
	font-weight: 600;
	position: sticky;
	top: 0;
	z-index: 10;
}

tr:hover td {
	background: rgba(255, 255, 255, 0.02);
}

.header-cell {
	font-weight: 600;
	color: #60a5fa;
	background: rgba(59, 130, 246, 0.03);
}

.loading-state, .empty-state {
	padding: 40px;
	text-align: center;
	color: var(--text-muted);
	font-style: italic;
}

.error-card {
	border-color: rgba(239, 68, 68, 0.4);
	background: rgba(239, 68, 68, 0.03);
	margin-bottom: 32px;
}

.error-header {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 12px;
}

.error-dot {
	width: 10px;
	height: 10px;
	background: #ef4444;
	border-radius: 50%;
	box-shadow: 0 0 8px #ef4444;
}

.error-card h3 {
	color: #fca5a5;
	font-size: 15px;
	margin: 0;
}

.error-msg {
	font-size: 13px;
	color: var(--text);
	background: rgba(0, 0, 0, 0.2);
	padding: 12px;
	border-radius: 6px;
	font-family: monospace;
	margin-bottom: 8px;
}

.error-hint {
	font-size: 12px;
	color: var(--text-muted);
}

.header-row-section .desc {
	font-size: 13px;
	color: var(--text-muted);
	margin-bottom: 16px;
}

.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}

.tag {
	background: rgba(63, 63, 70, 0.4);
	border: 1px solid var(--border);
	padding: 6px 12px;
	border-radius: 8px;
	font-size: 13px;
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.tag-index {
	background: var(--primary);
	font-size: 10px;
	font-weight: 700;
	color: white;
	width: 18px;
	height: 18px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tag-text {
	font-weight: 500;
}
</style>
