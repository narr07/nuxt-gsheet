import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Google Sheets Module DevTools</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
	<style>
		:root {
			--bg: #09090b;
			--card-bg: rgba(24, 24, 27, 0.6);
			--border: rgba(63, 63, 70, 0.4);
			--primary: #3b82f6;
			--primary-glow: rgba(59, 130, 246, 0.15);
			--success: #10b981;
			--text: #f4f4f5;
			--text-muted: #a1a1aa;
		}

		* {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
			font-family: 'Plus Jakarta Sans', sans-serif;
		}

		body {
			background-color: var(--bg);
			color: var(--text);
			padding: 32px;
			min-height: 100vh;
			background-image: 
				radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
				radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%);
		}

		header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 32px;
			border-bottom: 1px solid var(--border);
			padding-bottom: 20px;
		}

		h1 {
			font-size: 24px;
			font-weight: 700;
			background: linear-gradient(135deg, #fff 0%, var(--text-muted) 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			display: flex;
			align-items: center;
			gap: 10px;
		}

		.badge {
			background: var(--primary-glow);
			border: 1px solid var(--primary);
			color: #60a5fa;
			padding: 4px 10px;
			border-radius: 12px;
			font-size: 12px;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}

		.grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
			gap: 24px;
			margin-bottom: 32px;
		}

		.card {
			background: var(--card-bg);
			border: 1px solid var(--border);
			border-radius: 16px;
			padding: 24px;
			backdrop-filter: blur(12px);
			position: relative;
			overflow: hidden;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		}

		.card::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 3px;
			background: transparent;
			transition: background 0.3s ease;
		}

		.card:hover {
			transform: translateY(-2px);
			border-color: rgba(63, 63, 70, 0.8);
			box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.5);
		}

		.card.info:hover::before {
			background: linear-gradient(90deg, var(--primary), transparent);
		}

		.card.stat:hover::before {
			background: linear-gradient(90deg, var(--success), transparent);
		}

		.card-title {
			font-size: 14px;
			font-weight: 600;
			color: var(--text-muted);
			text-transform: uppercase;
			letter-spacing: 0.05em;
			margin-bottom: 12px;
		}

		.card-value {
			font-size: 32px;
			font-weight: 700;
			color: var(--text);
			margin-bottom: 8px;
		}

		.card-desc {
			font-size: 12px;
			color: var(--text-muted);
		}

		.section-title {
			font-size: 18px;
			font-weight: 600;
			margin-bottom: 16px;
			color: var(--text);
			display: flex;
			align-items: center;
			gap: 8px;
		}

		.config-table {
			width: 100%;
			border-collapse: collapse;
			background: var(--card-bg);
			border: 1px solid var(--border);
			border-radius: 12px;
			overflow: hidden;
		}

		.config-table th, .config-table td {
			padding: 14px 20px;
			text-align: left;
			border-bottom: 1px solid var(--border);
		}

		.config-table th {
			background: rgba(39, 39, 42, 0.4);
			color: var(--text-muted);
			font-size: 13px;
			font-weight: 600;
			text-transform: uppercase;
		}

		.config-table tr:last-child td {
			border-bottom: none;
		}

		.status-indicator {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			font-weight: 500;
			font-size: 13px;
		}

		.dot {
			width: 8px;
			height: 8px;
			border-radius: 50%;
		}

		.dot.green { background-color: var(--success); box-shadow: 0 0 8px var(--success); }
		.dot.yellow { background-color: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
		.dot.red { background-color: #ef4444; box-shadow: 0 0 8px #ef4444; }

		.dashboard-container {
			display: grid;
			grid-template-columns: 2fr 1fr;
			gap: 32px;
		}

		@media (max-width: 900px) {
			.dashboard-container {
				grid-template-columns: 1fr;
			}
		}

		.quota-bar {
			width: 100%;
			height: 6px;
			background: rgba(63, 63, 70, 0.5);
			border-radius: 3px;
			overflow: hidden;
			margin-top: 12px;
		}

		.quota-fill {
			height: 100%;
			background: var(--primary);
			width: 0%;
			transition: width 0.5s ease;
		}
	</style>
</head>
<body>
	<header>
		<h1>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3H19ZM19 7.5H14.5V5H19V7.5ZM13 5V7.5H8.5V5H13ZM5 5H7V7.5H5V5ZM5 9H7V11.5H5V9ZM5 13H7V15.5H5V13ZM5 17H7V19H5V17ZM8.5 19V17H13V19H8.5ZM14.5 19V17H19V19H14.5ZM19 15.5H14.5V13H19V15.5ZM13 13V15.5H8.5V13H13ZM8.5 11.5V9H13V11.5H8.5ZM14.5 11.5V9H19V11.5H14.5Z" fill="#10B981"/>
			</svg>
			Google Sheets Module
		</h1>
		<div class="badge">nuxt-gsheet</div>
	</header>

	<div class="grid">
		<div class="card stat">
			<div class="card-title">Total Requests</div>
			<div class="card-value" id="req-count">0</div>
			<div class="card-desc">HTTP proxy requests intercepted</div>
		</div>
		<div class="card stat">
			<div class="card-title">Cache Hit Rate</div>
			<div class="card-value" id="cache-rate">0%</div>
			<div class="card-desc" id="cache-stats">0 hits / 0 misses</div>
		</div>
		<div class="card stat">
			<div class="card-title">Estimated Quota</div>
			<div class="card-value" id="quota-count">0 / 300</div>
			<div class="card-desc">Google API requests per minute</div>
			<div class="quota-bar"><div class="quota-fill" id="quota-fill"></div></div>
		</div>
	</div>

	<div class="dashboard-container">
		<div>
			<div class="section-title">Configuration Diagnostics</div>
			<table class="config-table">
				<thead>
					<tr>
						<th>Setting</th>
						<th>Value / Status</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Active Mode</td>
						<td id="cfg-mode" style="font-weight: 600; text-transform: uppercase;">-</td>
					</tr>
					<tr>
						<td>Spreadsheet ID</td>
						<td id="cfg-spreadsheet-id" style="font-family: monospace; font-size: 13px;">-</td>
					</tr>
					<tr>
						<td>Apps Script URL</td>
						<td id="cfg-appscript-url" style="font-family: monospace; font-size: 13px;">-</td>
					</tr>
					<tr>
						<td>API Key Provided</td>
						<td id="cfg-api-key">-</td>
					</tr>
					<tr>
						<td>Service Account Credentials</td>
						<td id="cfg-credentials">-</td>
					</tr>
					<tr>
						<td>Caching Status</td>
						<td id="cfg-cache">-</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div>
			<div class="section-title">Mapped Sheet Keys</div>
			<div id="mapped-sheets-list" style="display: flex; flex-direction: column; gap: 12px;">
				<div class="card" style="padding: 16px; font-size: 14px; text-align: center; color: var(--text-muted);">
					No sheets mapped in nuxt.config
				</div>
			</div>
		</div>
	</div>

	<script>
		async function fetchStats() {
			try {
				const response = await fetch('/api/_gsheet/metrics');
				const data = await response.json();
				
				// Update stats
				document.getElementById('req-count').textContent = data.metrics.totalRequests;
				
				const totalHits = data.metrics.cacheHits;
				const totalMisses = data.metrics.cacheMisses;
				const total = totalHits + totalMisses;
				const rate = total > 0 ? Math.round((totalHits / total) * 100) : 0;
				
				document.getElementById('cache-rate').textContent = rate + '%';
				document.getElementById('cache-stats').textContent = totalHits + ' hits / ' + totalMisses + ' misses';
				
				// Quota usage (max 300 requests/min limit estimation)
				const quota = Math.min(300, data.metrics.quotaUsageEst);
				document.getElementById('quota-count').textContent = quota + ' / 300';
				const percent = Math.round((quota / 300) * 100);
				document.getElementById('quota-fill').style.width = percent + '%';
				
				// Config diagnostics
				document.getElementById('cfg-mode').textContent = data.config.auth;
				document.getElementById('cfg-spreadsheet-id').textContent = data.config.spreadsheetId;
				document.getElementById('cfg-appscript-url').textContent = data.config.appscriptUrl;
				
				document.getElementById('cfg-api-key').innerHTML = data.config.hasApiKey 
					? '<div class="status-indicator"><span class="dot green"></span>Active</div>' 
					: '<div class="status-indicator"><span class="dot yellow"></span>Not configured</div>';
				
				document.getElementById('cfg-credentials').innerHTML = data.config.hasCredentials 
					? '<div class="status-indicator"><span class="dot green"></span>Loaded</div>' 
					: '<div class="status-indicator"><span class="dot yellow"></span>Not configured</div>';
				
				document.getElementById('cfg-cache').innerHTML = data.config.cache.enabled 
					? '<div class="status-indicator"><span class="dot green"></span>Enabled (' + data.config.cache.maxAge + 's TTL)</div>' 
					: '<div class="status-indicator"><span class="dot red"></span>Disabled</div>';
				
				// Mapped sheets
				const sheetsList = document.getElementById('mapped-sheets-list');
				if (data.config.sheets && data.config.sheets.length > 0) {
					sheetsList.innerHTML = data.config.sheets.map(sheetName => \`
						<div class="card" style="padding: 14px 20px; display: flex; justify-content: space-between; align-items: center;">
							<span style="font-weight: 600;">\${sheetName}</span>
							<span class="badge" style="background: rgba(16, 185, 129, 0.1); border-color: var(--success); color: #34d399;">MAPPED</span>
						</div>
					\`).join('');
				} else {
					sheetsList.innerHTML = \`
						<div class="card" style="padding: 16px; font-size: 14px; text-align: center; color: var(--text-muted);">
							No sheets mapped in nuxt.config
						</div>
					\`;
				}
			} catch (err) {
				console.error('Error fetching DevTools stats:', err);
			}
		}

		// Initial load and poll every 3 seconds
		fetchStats();
		setInterval(fetchStats, 3000);
	</script>
</body>
</html>
	`
})
