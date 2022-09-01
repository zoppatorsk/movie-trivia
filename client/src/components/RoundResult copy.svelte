<script>
	export let currentCount;
	export let results;
	import { players } from '../lib/stores';
</script>

<h2>Round Results</h2>
<p class="correct-answer">{roundResults.correctAnswer}</p>
<div class="player-wrapper">
	{#each $players as player}
		<div>
			<img src={player.avatar} alt="avatar" />
			<p>{player.name}</p>
			<!-- <p>{roundResults.find((x) => x.id == player.id).answer} <span>{roundResults.find((x) => x.id == player.id).correct ? '✔' : '❌'} </span></p> -->
			<p>{roundResults.answers.get(player.id).answer ? roundResults.answers.get(player.id).answer : 'DNA'} <span>{roundResults.answers.get(player.id).correct ? '✔' : '❌'} </span></p>

			<p>{roundResults.answers.get(player.id).score}</p>
		</div>
	{/each}
</div>
{#if currentCount > 0}
	<h2>{currentCount}</h2>
{/if}

<style>
	.correct-answer {
		text-align: center;
	}
	h2 {
		text-align: center;
		margin-bottom: 0px;
	}
	img {
		margin-left: auto;
		margin-right: auto;
		display: block;
		width: 200px;
	}
	.player-wrapper {
		text-align: center;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
	}

	@media screen and (max-width: 700px) {
		.player-wrapper {
			text-align: center;

			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		img {
			max-height: 50px;
		}
	}
</style>
