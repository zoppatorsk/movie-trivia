<script>
	export let results;
	results.players.sort((a, b) => {
		return results.score.get(b.id) - results.score.get(a.id);
	});
</script>

<h2>Game Over</h2>
<!-- <div class="player-wrapper">
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
	{/each} -->
<div class="place-wrapper">
	<ol>
		{#each results.players as player}
			<li class="player-wrapper">
				#{results.placement.get(player.id)} <img src={player.avatar} alt="avatar" />
				<div class="player-name">{player.name}</div>
				<div class="score">{results.score.get(player.id)} pts</div>
			</li>
			<hr />
		{/each}
	</ol>
</div>

<style>
	h2 {
		text-align: center;
	}
	/* img {
		margin-left: auto;
		margin-right: auto;

		width: 200px;
	} */
	.place-wrapper {
		padding: 20px;
		width: 100vw;
		max-width: 1200px;
		margin: 0 auto;
	}
	.place-wrapper > ol {
		padding: 0;
	}

	.place-wrapper img {
		max-height: 50px;
	}
	.player-wrapper {
		width: 100%;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 20px;
		font-size: 60px;
	}
	.player-name {
		margin-right: 20px;
		max-width: 16ch;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.score {
		margin-left: auto;
	}
	hr {
		padding: 0;
		margin: 0;
		margin-top: -20px;
	}
	@media screen and (max-width: 900px) {
		.place-wrapper img {
			max-height: 26px;
		}
		.player-wrapper {
			font-size: 30px;
			gap: 10px;
		}
		hr {
			padding: 0;
			margin: 0;
			margin-top: -10px;
		}
		.player-name {
			max-width: 10ch;
		}
	}
	@media screen and (max-width: 400px) {
		.place-wrapper img {
			max-height: 20px;
		}
		.player-wrapper {
			font-size: 20px;
			gap: 10px;
		}
		hr {
			padding: 0;
			margin: 0;
			margin-top: -10px;
		}
		.player-name {
			max-width: 10ch;
		}
	}
</style>
