function quickPlay(games) {
	let gameId = '';
	//loop the games map and find open games with player slots left
	for (const [id, game] of games.entries()) {
		if (game.status == 'open' && game.players.size < game.maxPlayers) {
			gameId = game.id;
			break; //no need to continue loop after found one
		}
	}
	//if no game found the empty string from variable init wll be returned
	return gameId;
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

module.exports = { quickPlay, shuffleArray };
