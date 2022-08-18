<script>
	import { activeComponent } from '../lib/stores';
	export let socket;

	function createGame() {
		let data = { name: 'test' };
		socket.emit('create-game', data, (response) => {
			console.log(response.status);
			if (response.status === 'ok') {
				activeComponent.set('lobby');
			}
		});
	}

	function quickPlay() {
		socket.emit('quick-play', (response) => {
			if (response.gameId) {
				socket.emit('join-game', { gameId: response.gameId }, (response) => {
					if (response.status === 'ok') {
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

<div>
	<button on:click={createGame}>Create Game</button>
	<button on:click={quickPlay}>Quickplay</button>
	<button on:click={test}>List Games</button>
</div>

<style>
	button {
		color: white;
	}
</style>
