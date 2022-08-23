<script>
	import { io } from 'socket.io-client';
	import { activeComponent, players, gameProps } from './lib/stores/';
	import Start from './components/Start.svelte';
	import Lobby from './components/Lobby.svelte';
	import Question from './components/Question.svelte';
	import RoundResult from './components/RoundResult.svelte';
	import GameResult from './components/GameResult.svelte';
	import Chat from './components/Chat.svelte';
	import GameList from './components/GameList.svelte';

	let currentCount = -1;
	let currentQuestion = {};
	let roundResults;
	let connected = '';
	let message = '';
	let gameResults = {};
	let games = [
		{ name: 'test1', players: 2, maxPlayers: 4, rounds: 3 },
		{ name: 'test2', players: 2, maxPlayers: 4, rounds: 3 },
		{ name: 'test2', players: 2, maxPlayers: 4, rounds: 3 },
		{ name: 'test2', players: 2, maxPlayers: 4, rounds: 3 },
		{ name: 'test2', players: 2, maxPlayers: 4, rounds: 3 },
	];
	//do we need to put stuff in onmount?? guess will find out later..

	const socket = io('http://localhost:3000');

	socket.on('connect', () => {
		//put some icon or somthing later
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
		currentCount = count;
	});

	socket.on('ready-round', (question) => {
		console.log('q', question);
		currentQuestion = question;
		socket.emit('player-ready-round', $gameProps.id);
	});

	socket.on('round-start', () => {
		//later determine by type what question componneet to use
		$activeComponent = 'question';
	});

	socket.on('end-round', (results) => {
		roundResults = { ...results };
		roundResults.answers = new Map(roundResults.answers);
		console.log('round results', results.size);
		$activeComponent = 'roundresult';
	});

	socket.on('end-game', (results) => {
		gameResults = { ...results };
		gameResults.lastRound.answers = new Map(gameResults.lastRound.answers); //convert back to map
		gameResults.score = new Map(gameResults.score); //convert back to map

		$activeComponent = 'gameresult';
		console.log('game results', gameResults);
	});
	socket.on('global-chat', (m) => {
		console.log('got global chat', m);
		message = m;
	});
</script>

<div>
	<!-- <Chat {socket} {message} /> -->
	{#if $activeComponent === 'start'}
		<Start {socket} />
	{/if}
	{#if $activeComponent === 'lobby'}
		<Lobby {socket} {currentCount} />
	{/if}
	{#if $activeComponent === 'question'}
		<Question {currentCount} {socket} question={currentQuestion} />
	{/if}
	{#if $activeComponent === 'roundresult'}
		<RoundResult {currentCount} {roundResults} />
	{/if}
	{#if $activeComponent === 'gameresult'}
		<GameResult results={gameResults} />
	{/if}
	{#if $activeComponent === 'GameList'}
		<GameList {socket} />
	{/if}
</div>
