<script>
	import { activeComponent, players, gameProps, playerId } from '../lib/stores';
	export let socket;

	function createGame() {
		let data = { name: 'test' };
		socket.emit('create-game', data, (response) => {
			console.log(response.status);
			if (response.status === 'ok') {
				//set all the other response data in store.. playerId and gameData
				players.set(response.players);
				gameProps.set(response.gameData);
				playerId.set(response.playerId);
				//move to lobby
				activeComponent.set('lobby');
			}
		});
	}

	/// if find open game will join it
	function quickPlay() {
		socket.emit('quick-play', (response) => {
			if (response.gameId) {
				socket.emit('join-game', { gameId: response.gameId }, (response) => {
					if (response.status === 'ok') {
						//set all the other response data in store.. playerId and gameData
						players.set(response.players);
						gameProps.set(response.gameData);
						playerId.set(response.playerId);
						//move to lobby
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
