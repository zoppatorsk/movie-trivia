<script>
	import { players, gameProps } from '../lib/stores';
	export let socket;
	export let currentCount;
	let clicked = false;
	console.log('p', $players);

	function playerReady() {
		clicked = true;
		socket.emit('player-ready', $gameProps.id);
	}
</script>

<div class="component-wrapper">
	<h1>Lobby</h1>
	<h2>{$gameProps.id}</h2>
	{#if currentCount > 0}
		<h2>{currentCount}</h2>
	{/if}
	<div class="player-wrapper">
		{#each $players as player}
			<div>
				<img src={player.avatar} alt="avatar" />
				<p>{player.name}</p>
			</div>
		{/each}
	</div>

	<button on:click|once={playerReady} disabled={clicked}>Ready</button>
</div>

<style>
	.component-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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

			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		img {
			max-height: 50px;
		}
	}
</style>
