<script>
	export let results;
	// results.players.sort((a, b) => {
	// 	return results.score.get(b.id) - results.score.get(a.id);
	// });
</script>

<h2>Game Over</h2>
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
<div class="last-round-wrapper">
	<h2>Last Round</h2>
	<p>Correct Answer: {results.lastRound.correctAnswer}</p>
	<div class="flex-row">
		{#each results.players as player}
			<div class="last-round-player-wrapper">
				<img src={player.avatar} alt="avatar" />
				<p>{player.name}</p>
				<p class="player-answer"><span>{results.lastRound.answers.get(player.id).correct ? '✔' : '❌'} </span>{results.lastRound.answers.get(player.id).answer ? results.lastRound.answers.get(player.id).answer : 'DNA'}</p>
				<p>{results.lastRound.answers.get(player.id).score} pts</p>
			</div>
		{/each}
	</div>
</div>

<style>
	h2 {
		text-align: center;
	}
	.player-answer {
		max-width: 300px;
		text-align: center;
		font-size: 0.8rem;
		max-width: 34ch;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: baseline;
	}

	.place-wrapper {
		padding: 20px;
		width: 100vw;
		max-width: 1200px;
		margin: 0 auto;
	}
	.last-round-wrapper {
		padding: 20px;
		width: 100vw;

		margin: 0 auto;
	}
	.last-round-wrapper h2 {
		text-align: center;
		margin-bottom: 1rem;
	}
	.last-round-wrapper > p {
		text-align: center;
		margin: 0;
	}

	.last-round-player-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 20px;
	}
	.last-round-player-wrapper p {
		margin: 0;
	}
	.last-round-player-wrapper img {
		width: 120px;
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
