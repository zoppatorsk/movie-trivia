<script>
	import { players, gameProps } from '../lib/stores';
	import { tweened } from 'svelte/motion';
	export let socket;
	export let currentCount;
	let clicked = false;

	function playerReady() {
		clicked = true;
		socket.emit('player-ready', $gameProps.id);
	}
	const progress = tweened($gameProps.waitBetweenRound, {
		duration: 1000,
	});
	$: if (currentCount > -1) {
		progress.set(currentCount - 1);
	}
</script>

<div class="component-wrapper">
	<h1>Lobby</h1>
	<h2>{$gameProps.name}</h2>

	<div class="player-wrapper">
		{#each $players as player}
			<div>
				<img src={player.avatar} alt="avatar" />
				<p>{player.name}</p>
			</div>
		{/each}
	</div>

	<button on:click|once={playerReady} disabled={clicked}>Ready</button>
	<progress value={$progress} max={$gameProps.waitBetweenRound} />

	<h2>{currentCount > -1 ? currentCount : 'Waiting'}</h2>
</div>

<style>
	.component-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}
	h1 {
		margin-bottom: 0px;
	}
	h2 {
		font-size: 1rem;
	}
	button {
		max-width: 200px;
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
			gap: 10px;
			/* flex-direction: column; */
			justify-content: center;
		}
		img {
			height: 50px;
			width: auto;
		}
	}
</style>
