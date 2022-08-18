<script>
	import { io } from 'socket.io-client';
	import { activeComponent } from './lib/stores/';
	import Start from './components/Start.svelte';
	import Lobby from './components/Lobby.svelte';

	let connected = '';
	//do we need to put stuff in onmount?? guess will find out later..

	const socket = io('http://localhost:3000');

	socket.on('connect', () => {
		connected = 'We got a signal!';
	});
</script>

<main>
	<h1>{connected}</h1>
	{#if $activeComponent === 'start'}
		<Start {socket} />
	{/if}
	{#if $activeComponent === 'lobby'}
		<Lobby {socket} />
	{/if}
</main>

<style>
</style>
