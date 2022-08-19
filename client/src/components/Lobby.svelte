<script>
	import { players, gameProps } from '../lib/stores';
	export let socket;
	console.log('p', $players);

	function playerReady() {
		console.log('click');
		socket.emit('player-ready', $gameProps.id);
	}
</script>

<h1>Lobby</h1>
<h2>{$gameProps.id}</h2>
{#each $players as player}
	<div>
		{player.id}
	</div>
{/each}

<button on:click|once={playerReady}>Ready</button>

<style>
	button {
		color: white;
	}
</style>
