<script>
	import { onMount } from 'svelte';

	import { gameProps, players, player, activeComponent, categories } from '../lib/stores';
	export let socket;

	//hold settings, what put here will be the default
	const settings = {
		rounds: 3,
		maxPlayers: 3,
		roundTime: 30,
		waitBetweenRounds: 5,
		name: `${$player.name}'s Game`,
		category: -1,
		difficulty: 'Medium',
	};

	const difficulty = ['Easy', 'Medium', 'Hard'];
	let selectedDifficult = 1;
	$: settings.difficulty = difficulty[selectedDifficult];

	$: console.log(settings);

	function createGame(gameSettings) {
		console.log('gs', gameSettings);
		// activeComponent.set('GameSettings');
		let data = { name: $player.name, avatar: $player.seed, settings: gameSettings };
		socket.emit('create-game', data, (response) => {
			console.log(response.status);
			if (response.status === 'ok') {
				//set all the other response data in store.. playerId and gameData
				players.set(response.players);
				gameProps.set(response.gameData);
				$player.id = response.playerId;
				//move to lobby
				activeComponent.set('Lobby');
			}
		});
	}
	console.log('gs', settings);
</script>

<div>
	<h2>Game Options</h2>
	<form>
		<label for="gameName">Game Name</label>
		<input id="gameName" type="text" bind:value={settings.name} />

		<label for="category">Category</label>
		<select id="category" bind:value={settings.category}>
			<option value={-1}>Mixed From All</option>
			{#each $categories as category}
				<option value={category.id}>{category.name}</option>
			{/each}
		</select>
		<label for="Difficulty">Difficulty: {settings.difficulty}</label>
		<input id="maxPlayers" type="range" min="0" max="2" bind:value={selectedDifficult} />

		<label for="rounds">Rounds: {settings.rounds}</label>
		<input id="rounds" type="range" min="1" max="10" bind:value={settings.rounds} />
		<label for="maxPlayers">Max Players: {settings.maxPlayers}</label>
		<input id="maxPlayers" type="range" min="1" max="5" bind:value={settings.maxPlayers} />
		<label for="roundTime">Round Time: {settings.roundTime}s</label>
		<input id="roundTime" type="range" min="10" max="60" bind:value={settings.roundTime} />
		<label for="waitTimeBetweenRounds">Wait Between Rounds: {settings.waitBetweenRounds}s</label>
		<input id="waitTimeBetweenRounds" type="range" min="1" max="20" bind:value={settings.waitBetweenRounds} />
		<button on:click|preventDefault={() => createGame(settings)}>Create Game</button>
	</form>
</div>

<style>
	h2 {
		margin-bottom: 10px;
	}
</style>
