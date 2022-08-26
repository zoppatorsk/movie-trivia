<script>
	export let results;
	export let socket;
	import { activeComponent, gameProps } from '../lib/stores';

	const back = () => {
		socket.emit('leave-room', $gameProps.id);
		$activeComponent = 'Start';
	};
</script>

<button class="back" on:click={back}>Back</button>
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
	.back {
		position: absolute;
		top: 10px;
		left: 10px;
		width: 100px;
		padding: 10px;
	}
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
		gap: 10px;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
	}
</style>
