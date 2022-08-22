<script>
	import { onMount, afterUpdate } from 'svelte';

	export let socket;
	export let message;
	let chatMessage = '';
	let messages = [];
	let messagebox;
	$: if (message) {
		messages = [...messages, message];
	}

	onMount(() => {});

	const scrollToBottom = async (node) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};
	function sendMessage() {
		if (chatMessage) {
			messages = [...messages, chatMessage];

			socket.emit('global-chat', chatMessage);
			chatMessage = '';
		}
	}

	//scroll to bottom of chatbox after new message
	afterUpdate(() => {
		if (messages) scrollToBottom(messagebox);
	});
</script>

<div>
	<div bind:this={messagebox} class="messages">
		{#each messages as message}
			<div>{message}</div>
		{/each}
	</div>
	<form on:submit|preventDefault={sendMessage}>
		<input type="text" bind:value={chatMessage} />
	</form>
</div>

<style>
	.messages {
		height: 200px;
		overflow-y: scroll;
		border: 1px solid black;
	}
</style>
