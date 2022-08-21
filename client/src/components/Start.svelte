<script>
	import { onMount } from 'svelte';

	import { activeComponent, players, gameProps, playerId } from '../lib/stores';
	export let socket;

	onMount(() => {
		let player = localStorage.getItem('player');
		if (player !== null) {
			player = JSON.parse(player);
			// @ts-ignore
			playername = player?.name || '';
			// @ts-ignore
			seed = player?.seed || '';
		}
	});

	let playername = '';
	let seed = '';

	$: {
		if (playername || seed) localStorage.setItem('player', JSON.stringify({ name: playername, seed: seed }));
	}

	function createGame() {
		let data = { name: playername, avatar: seed };
		socket.emit('create-game', data, (response) => {
			console.log(response.status);
			if (response.status === 'ok') {
				//set all the other response data in store.. playerId and gameData
				players.set(response.players);
				gameProps.set(response.gameData);
				playerId.set(response.playerId);
				//move to lobby
				activeComponent.set('lobby');
			}
		});
	}

	/// if find open game will join it
	function quickPlay() {
		socket.emit('quick-play', (response) => {
			if (response.gameId) {
				socket.emit('join-game', { gameId: response.gameId, name: playername, avatar: seed }, (response) => {
					if (response.status === 'ok') {
						//set all the other response data in store.. playerId and gameData
						players.set(response.players);
						gameProps.set(response.gameData);
						playerId.set(response.playerId);
						//move to lobby
						activeComponent.set('lobby');
					}
				});
			} else alert('no game found');
		});
	}

	function test() {
		socket.emit('test');
	}
</script>

<div class="wrapper">
	<h1>Let's Play!</h1>
	<img src={`https://avatars.dicebear.com/api/avataaars/:${seed}.svg`} alt="avatar" />

	<input type="text" placeholder="Enter name" bind:value={playername} />
	<input type="text" placeholder="Avatar Seed" bind:value={seed} />
	<div class="buttons" class:disabled={!seed || !playername}>
		<button on:click={createGame}>Create Game</button>
		<button on:click={quickPlay}>Quickplay</button>
		<button on:click={test}>List Games</button>
	</div>
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
