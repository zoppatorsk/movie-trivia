<script>
	import Rank from './lib/Rank.svelte';
	import { answer } from './lib/stores/answer.js';
	import { io } from 'socket.io-client';

	const socket = io('http://localhost:3000');
	let arr = [
		{ src: './images/1.jpg', id: '1' },
		{ src: './images/2.jpg', id: '2' },
		{ src: './images/3.jpg', id: '3' },
		{ src: './images/4.jpg', id: '4' },
	];
	let show = true;
	function checkOrder() {
		show = !show;
		// movies.childNodes.forEach((item, index) => {
		// 	console.log(item.id);
		// });
	}
	function logOrder() {
		console.log($answer);
	}
</script>

<main>
	{#if show}
		<Rank movieArray={arr} />
	{/if}
	<button on:click={checkOrder}>hej</button>
	<button on:click={logOrder}>log</button>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}
	.droptarget {
		width: 1200px;
		height: 400px;
		border: 1px solid #ccc;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.movies {
		width: 1200px;
		height: 400px;
		border: 1px solid #ccc;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
</style>
