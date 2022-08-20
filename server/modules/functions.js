function disconnecting(io, socket, games) {
	//check if player is in a game and if so remove them from the game..
	if (socket.rooms.size > 1) {
		for (const room of socket.rooms) {
			if (room !== socket.id) {
				const game = games.get(room);
				game?.leave(socket.id);

				//delete room if empty
				if (game?.players.size === 0) games.delete(room);
				else {
					//notify the other players that the player has left the game
					io.to(game.id).emit('player-left', socket.id);
					//-----chek the state of the game and finish round if all other playeres have asnwered
				}
				break;
			}
		}
	}
}

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
