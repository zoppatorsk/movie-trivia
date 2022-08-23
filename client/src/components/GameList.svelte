<script>
	import { onMount } from 'svelte';

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

		//maybe later extract current joingame function in start.svelte n pass it down to this component
		//shld put player n junk into a store o pass it down to this component

		//socket.emit('join-game', game.id);
	}
</script>

<div class="container">
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
