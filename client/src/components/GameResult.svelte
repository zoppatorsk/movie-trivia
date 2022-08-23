<script>
	export let results;
</script>

<h2>Game Over</h2>
<div class="player-wrapper">
	{#each results.players as player}
		<div>
			<img src={player.avatar} alt="avatar" />
			<p>{player.name}</p>
			<p>Last Round Results:</p>
			<p>{results.lastRound.answers.get(player.id).answer ? results.lastRound.answers.get(player.id).answer : 'DNA'} <span>{results.lastRound.answers.get(player.id).correct ? '✔' : '❌'} </span></p>
			<p>{results.lastRound.answers.get(player.id).score}</p>
			<p>Game Results:</p>
			<p>Place: {results.placement.get(player.id)}</p>
			<p>{results.score.get(player.id)}</p>
		</div>
	{/each}
</div>

<style>
	h2 {
		text-align: center;
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
</style>
