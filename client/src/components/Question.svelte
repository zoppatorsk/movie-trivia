<script>
	import { gameProps } from '../lib/stores';
	export let currentCount;
	export let socket;

	function answerCorrect() {
		socket.emit('answer', $gameProps.id, 'correct');
	}
	function answerIncorrect() {
		socket.emit('answer', $gameProps.id, 'incorrect');
	}
</script>

<h2>Question goes here</h2>
<button on:click={answerCorrect}>Answer correct</button>
<button on:click={answerIncorrect}>Answer incorrect</button>
{#if currentCount > 0}
	<h2>{currentCount}</h2>
{/if}
