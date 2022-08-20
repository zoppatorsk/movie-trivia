<script>
	import { io } from 'socket.io-client';
	import { activeComponent, players, gameProps } from './lib/stores/';
	import Start from './components/Start.svelte';
	import Lobby from './components/Lobby.svelte';
	import Question from './components/Question.svelte';
	import RoundResult from './components/RoundResult.svelte';

	let currentCount = 0;

	let connected = '';
	//do we need to put stuff in onmount?? guess will find out later..

	const socket = io('http://localhost:3000');

	socket.on('connect', () => {
		connected = 'We got a signal!';
	});

	//when player in disconnects
	socket.on('player-joined', (player) => {
		console.log('player joined', player);
		//new player joined so at it to the store
		$players = [...$players, player];
	});

	socket.on('player-left', (playerId) => {
		console.log('got playerLeft');
		$players = $players.filter((player) => player.id !== playerId);
	});

	socket.on('count-down', (count) => {
		console.log('co', currentCount);
		currentCount = count;
	});

	socket.on('start-round', () => {
		console.log('start round');
		$activeComponent = 'question';
		socket.emit('round-started', $gameProps.id);
		//new player joined so at it to the store
	});

	socket.on('end-round', () => {
		console.log('end round, show results');
		$activeComponent = 'roundresult';
		//socket.emit('round-started', $gameProps.id);
		//new player joined so at it to the store
	});
</script>

<main>
	<h1>{connected}</h1>
	{#if $activeComponent === 'start'}
		<Start {socket} />
	{/if}
	{#if $activeComponent === 'lobby'}
		<Lobby {socket} {currentCount} />
	{/if}
	{#if $activeComponent === 'question'}
		<Question {currentCount} />
	{/if}
	{#if $activeComponent === 'roundresult'}
		<RoundResult {currentCount} />
	{/if}
</main>
