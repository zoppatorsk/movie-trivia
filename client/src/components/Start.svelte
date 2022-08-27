<script>
	import { onMount } from 'svelte';

	import { activeComponent, players, gameProps, player } from '../lib/stores';
	export let socket;

	//get player name and seed from localstorage
	onMount(() => {
		let p = localStorage.getItem('player');
		if (p !== null) {
			$player = JSON.parse(p);
		}
	});

	//set player name and seed to localstorage when it chages
	$: {
		if ($player.name || $player.seed) localStorage.setItem('player', JSON.stringify($player));
	}

	/// if find open game will join it
	function quickPlay() {
		socket.emit('quick-play', (response) => {
			if (response.gameId) {
				socket.emit('join-game', { gameId: response.gameId, name: $player.name, avatar: $player.seed }, (response) => {
					if (response.status === 'ok') {
						players.set(response.players);
						gameProps.set(response.gameData);
						$player.id = response.playerId;
						//move to lobby
						activeComponent.set('Lobby');
					}
				});
			} else alert('no game found');
		});
	}

	function gameList() {
		//socket.emit('test');
		activeComponent.set('GameList');
	}
	function test() {
		socket.emit('test');
	}
</script>

<div class="wrapper">
	<h1>Let's Play!</h1>
	<img src={`https://avatars.dicebear.com/api/avataaars/:${$player.seed}.svg`} alt="avatar" />

	<input type="text" placeholder="Enter name" bind:value={$player.name} />
	<input type="text" placeholder="Avatar Seed" bind:value={$player.seed} />
	<div class="buttons" class:disabled={!$player.seed || !$player.name}>
		<button on:click={() => activeComponent.set('GameSettings')}>Create Game</button>
		<button on:click={quickPlay}>Quickplay</button>
		<!-- <button on:click={gameList}>List Games</button> -->
	</div>
	<!-- <button on:click={test}>test</button> -->
</div>

<style>
	h1 {
		text-align: center;
		margin: 0;
		padding: 0;
	}

	.wrapper {
		max-width: 1200px;
		margin: 0 auto;
	}

	.buttons {
		display: flex;
		flex-direction: row;
		gap: 20px;
		align-items: center;
	}
	img {
		display: block;
		margin-left: auto;
		margin-right: auto;
		max-height: 500px;
		margin-bottom: 20px;
	}

	@media screen and (max-width: 600px) {
		.wrapper {
			max-width: 300px;
		}
		.buttons {
			flex-direction: column;
			gap: 10px;
		}
		img {
			width: auto;
			max-height: 180px;
		}
	}
</style>
