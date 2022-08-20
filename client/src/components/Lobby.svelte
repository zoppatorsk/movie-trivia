<script>
	import { players, gameProps } from '../lib/stores';
	export let socket;
	export let currentCount;
	console.log('p', $players);

	function playerReady() {
		console.log('click');
		socket.emit('player-ready', $gameProps.id);
	}
</script>

<h1>Lobby</h1>
<h2>{$gameProps.id}</h2>
{#if currentCount > 0}
	<h2>{currentCount}</h2>
{/if}
{#each $players as player}
	<div>
		{player.id}
	</div>
{/each}

<button on:click|once={playerReady}>Ready</button>
