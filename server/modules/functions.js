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

module.exports = { disconnecting, quickPlay };
