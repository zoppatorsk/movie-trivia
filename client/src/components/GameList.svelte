<script>
	import { onMount } from 'svelte';
	import { player, activeComponent, gameProps, players } from '../lib/stores/';

	//export let games;
	let games = [];
	export let socket;

	onMount(() => {
		socket.emit('get-game-list', (response) => {
			games = response;
		});
	});

	function joinGame(game) {
		console.log('join game');
		socket.emit('join-game', { gameId: game, name: $player.name, avatar: $player.seed }, (response) => {
			if (response.status === 'ok') {
				players.set(response.players);
				gameProps.set(response.gameData);
				$player.id = response.playerId;
				//move to lobby
				activeComponent.set('Lobby');
			} else alert('Could not join game'); //later add modal instead of alert
		});
	}
</script>

<div class="container">
	<h1>Open Games</h1>
	<ul class="game-list">
		{#each games as game}
			<li>
				<div class="flex-col">
					<h2>{game.name}</h2>
				</div>
				<div class="flex-row">
					<p>Players: {game.players}/{game.maxPlayers}</p>
					<p>Rounds: {game.rounds}</p>
				</div>
				<button
					on:click={() => {
						joinGame(game.id);
					}}>Join</button
				>
			</li>
		{/each}
	</ul>
</div>

<style>
	h2 {
		font-size: 1.1rem;
	}
	.flex-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
	.game-list {
		list-style: none;
		padding: 0;
		overflow-y: scroll;
		max-height: 800px;
	}
	.game-list {
		width: 500px;
	}
	.game-list li {
		width: 100%;

		/* display: flex;
		align-items: center; */
		padding: 0.5rem;
		border-bottom: 1px solid #ccc;
	}
	.game-list h2 {
		font: 1rem;
		margin: 0;
	}
	.game-list p {
		font: 1rem;
		margin: 0;
	}
</style>
