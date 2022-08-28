<script>
	import { io } from 'socket.io-client';
	import { activeComponent, players, gameProps, player, categories } from './lib/stores/';
	import Start from './components/Start.svelte';
	import Lobby from './components/Lobby.svelte';
	import Question from './components/Question.svelte';
	import RoundResult from './components/RoundResult.svelte';
	import GameResult from './components/GameResult.svelte';
	import BackButton from './components/BackButton.svelte';
	import Chat from './components/Chat.svelte';
	import GameList from './components/GameList.svelte';
	import GameSettings from './components/GameSettings.svelte';
	import { onMount } from 'svelte';

	let currentCount = -1;
	let currentQuestion = {};
	let roundResults;
	let connected = '';
	let message = '';
	let gameResults = {};

	// get categories from api
	onMount(async () => {
		const res = await fetch(`https://opentdb.com/api_category.php`);
		const { trivia_categories } = await res.json();

		//sort trivia_categories by name property
		trivia_categories.sort((a, b) => {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});

		$categories = trivia_categories;
	});

	const socket = io(import.meta.env.VITE_IO_CONNECT_STRING);

	socket.on('connect', () => {
		$activeComponent = 'Start';
	});

	//when player in disconnects
	socket.on('player-joined', (player) => {
		console.log('player joined', player);
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
		currentCount = -1;
		console.log('q', question);
		currentQuestion = question;
		socket.emit('player-ready-round', $gameProps.id);
	});

	socket.on('round-start', () => {
		//later determine by type what question componneet to use
		$activeComponent = 'Question';
	});

	socket.on('end-round', (results) => {
		roundResults = { ...results };
		roundResults.answers = new Map(roundResults.answers);
		$activeComponent = 'RoundResult';
	});

	socket.on('end-game', (results) => {
		gameResults = { ...results };
		gameResults.lastRound.answers = new Map(gameResults.lastRound.answers); //convert back to map
		gameResults.score = new Map(gameResults.score); //convert back to map
		gameResults.placement = new Map(gameResults.placement); //convert back to map
		console.log('gameResults', gameResults.placement);

		$activeComponent = 'GameResult';
		console.log('game results', gameResults);
		currentCount = -1;
	});
	socket.on('global-chat', (m) => {
		console.log('got global chat', m);
		message = m;
	});
</script>

<div>
	<!-- <Chat {socket} {message} /> -->
	{#if $activeComponent !== 'Start'}
		<BackButton {socket} />
	{/if}

	{#if $activeComponent === 'Start'}
		<Start {socket} />
	{/if}
	{#if $activeComponent === 'Lobby'}
		<Lobby {socket} {currentCount} />
	{/if}
	{#if $activeComponent === 'Question'}
		<Question {currentCount} {socket} question={currentQuestion} />
	{/if}
	{#if $activeComponent === 'RoundResult'}
		<RoundResult {currentCount} {roundResults} />
	{/if}
	{#if $activeComponent === 'GameResult'}
		<GameResult results={gameResults} />
	{/if}
	{#if $activeComponent === 'GameList'}
		<GameList {socket} />
	{/if}
	{#if $activeComponent === 'GameSettings'}
		<GameSettings {socket} />
	{/if}
</div>
