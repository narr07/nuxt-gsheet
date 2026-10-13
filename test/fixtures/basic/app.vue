<template>
	<div>
		<div>basic</div>
		<GsheetTable
			range="A1:C3"
			sheet="Products"
			columns="price,name"
			limit="1"
		/>
	</div>
</template>

<script setup>
</script>
