<script>
	import { gameProps } from '../lib/stores';
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	export let currentCount;
	export let socket;
	export let question;
	let hasAnswered = false;

	function sendAnswer(answer) {
		if (hasAnswered) return;
		hasAnswered = true;
		socket.emit('answer', $gameProps.id, answer);
	}
	const progress = tweened($gameProps.roundTime, {
		duration: 1000,
	});
	$: if (currentCount > -1) {
		progress.set(currentCount - 1);
	}
</script>

<div class="wrapper">
	<h2>{question.question}</h2>
	{#each question.answers as answer}
		<button disabled={hasAnswered} on:click={() => sendAnswer(answer)}>{answer}</button>
	{/each}

	Time left:
	<progress value={$progress} max={$gameProps.roundTime} />
	<h3>{currentCount}</h3>
</div>

<style>
	.wrapper {
		padding: 20px;
	}
</style>
