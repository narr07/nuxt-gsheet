<script setup lang="ts">
import { computed } from 'vue'
import { useGSheet } from '../composables/useGSheet'
import { buildTable } from '../utils/table'

const props = defineProps<{
	range: string
	sheet?: string
	query?: string
	columns?: string | string[]
	limit?: number | string
	offset?: number | string
}>()

// No top-level await: the fetch still runs during SSR, and the component
// keeps working in renderers that do not wrap it in <Suspense>
const { data, error, status } = useGSheet(props.range, {
	sheet: props.sheet,
	query: props.query,
	key: `gsheet_table:${props.sheet || ''}:${props.range}:${props.query || ''}`
})

const table = computed(() => buildTable(data.value, {
	columns: props.columns,
	limit: props.limit,
	offset: props.offset
}))
</script>

<template>
	<p
		v-if="error"
		class="gsheet-table-status gsheet-table-error"
		role="alert"
	>
		{{ error.statusMessage || error.message || 'Failed to load sheet data.' }}
	</p>
	<p
		v-else-if="status === 'pending' && !table.headers.length"
		class="gsheet-table-status"
	>
		Loading…
	</p>
	<p
		v-else-if="!table.headers.length"
		class="gsheet-table-status"
	>
		No data.
	</p>
	<div
		v-else
		class="gsheet-table-wrapper"
	>
		<table class="gsheet-table">
			<thead>
				<tr>
					<th
						v-for="header in table.headers"
						:key="header"
						scope="col"
					>
						{{ header }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(row, rowIdx) in table.rows"
					:key="rowIdx"
				>
					<td
						v-for="(cell, cellIdx) in row"
						:key="cellIdx"
					>
						{{ cell }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style>
/* Zero-specificity defaults: any prose or app stylesheet overrides them */
:where(.gsheet-table-wrapper) {
	overflow-x: auto;
}

:where(.gsheet-table) {
	width: 100%;
	border-collapse: collapse;
	text-align: left;
}

:where(.gsheet-table) :where(th, td) {
	padding: 0.5em 0.75em;
	border-bottom: 1px solid color-mix(in srgb, currentColor 20%, transparent);
}

:where(.gsheet-table) :where(th) {
	font-weight: 600;
}
</style>
