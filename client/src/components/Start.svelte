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
		//implement later
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
