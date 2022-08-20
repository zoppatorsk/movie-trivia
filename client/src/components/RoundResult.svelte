<script>
	export let currentCount;
</script>

<h2>Here should be results from round</h2>
{#if currentCount > 0}
	<h2>{currentCount}</h2>
{/if}
