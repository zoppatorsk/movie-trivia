<script>
	export let socket;
	import { activeComponent, gameProps } from '../lib/stores';

	const back = () => {
		if ($gameProps?.id) {
			socket.emit('leave-room', $gameProps.id);
			$gameProps.id = '';
		}
		activeComponent.set('Start');
	};
</script>

<button class="back" on:click={back}>Back</button>

<style>
	button {
		position: absolute;
		top: 10px;
		left: 10px;
		width: 100px;
		padding: 10px;
	}
</style>
