<script>
	import { onMount, onDestroy } from 'svelte';
	import Sortable from 'sortablejs';
	import { answer } from '../lib/stores/answer.js';

	export let movieArray;

	//let movieArray = [];
	let movies;
	let sortableList;

	onMount(() => {
		console.log('onMount');
		console.log(movieArray);
		movies = document.querySelector('.movies');
		sortableList = new Sortable(movies, {
			group: 'shared',
			animation: 150,
		});
	});
	onDestroy(() => {
		//setAnswer();
	});

	function setAnswer() {
		console.log('answer set');
		let arr = [];
		movies.childNodes.forEach((item) => {
			arr.push(item.id);
		});
		sortableList.destroy();
		answer.set(arr);
	}
</script>

<div class="movies">
	{#each movieArray as movie}
		<img src={movie.src} alt="" id={movie.id} class="movie-item" />
	{/each}
</div>
<button on:click|once={setAnswer}>Done</button>
