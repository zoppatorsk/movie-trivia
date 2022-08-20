<script>
	export let currentCount;
</script>

<h2>Question goes here</h2>
<button>Answer correct</button>
<button>Answer incorrect</button>
{#if currentCount > 0}
	<h2>{currentCount}</h2>
{/if}
