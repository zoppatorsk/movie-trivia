<script>
	import { gameProps } from '../lib/stores';
	export let currentCount;
	export let socket;
	export let question;
	let hasAnswered = false;

	function sendAnswer(answer) {
		if (hasAnswered) return;
		hasAnswered = true;
		socket.emit('answer', $gameProps.id, answer);
	}
</script>

<h2>{question.question}</h2>
{#each question.answers as answer}
	<button disabled={hasAnswered} on:click={() => sendAnswer(answer)}>{answer}</button>
{/each}

Time left:
<progress value={currentCount} max={$gameProps.roundTime} />
<h3>{currentCount}</h3>
