const Game = require('./Game');
const Player = require('./Player');
const games = new Map(); //use a map to store all the games so can easily access them by id

module.exports = function (io) {
	io.on('connection', function (socket) {
		const count = io.engine.clientsCount;
		console.log(socket.id + ' connected c:' + count); //just for debugging purposes

		//use disconnecting instead of discconnect so still have access to room of socket n stuff
		socket.on('disconnecting', () => {
			//check if player is in a game and if so remove them from the game..
			if (socket.rooms.size > 1) {
				for (const room of socket.rooms) {
					if (room !== socket.id) {
						const game = games.get(room);
						game?.leave(socket.id);

						//delete room if empty
						if (game?.players.size === 0) games.delete(room);
						else {
							io.to(game.id).emit('player-left', socket.id);
							//checkStatus(game);
							//notify the other players that the player has left the game
							//chek the state of the game and finish round if all other playeres have asnwered
						}
						break;
					}
				}
			}
			console.log(socket.id + ' disconnecting');
		});
		// socket.on('disconnect', () => {
		// 	console.log(socket.id + ' disconnected');
		// 	socket.broadcast.emit('player-left', socket.id);
		// });

		//data should hold player details n game settings, just omitt for now and run on default settings
		socket.on('create-game', function (data, callback) {
			console.log('create-game');

			//create the game
			const game = new Game();

			//create the player.. later add junk like name n such.
			const player = new Player({ id: socket.id });

			//add the player to the game
			game.join(player);

			//store the game in the games map
			games.set(game.id, game);

			//join the socket into a room for the game.. roomname is same as game.id
			socket.join(game.id);

			//-----here we should create the questions that the game will use

			//callback to the client that the game has been created
			//this should take the player to the lobby.
			callback({ status: 'ok', playerId: player.id, gameData: game.getPublicData(), players: game.getPlayersAsArray() });
		});

		//when a player want to joins a game
		socket.on('join-game', function (data, callback) {
			const { gameId } = data;
			console.log('join-game', data);
			//data shld be like { player: { name: '', etc.. }, gameid: '' }

			//check the game status n stuff so it is ok to join
			const game = games.get(gameId);

			//create player
			const player = new Player({ id: socket.id });
			//try to join the game
			const successfullJoin = game.join(player);
			//if ok then join socket room
			if (successfullJoin) {
				socket.join(gameId);
				socket.to(game.id).emit('player-joined', player); //emit to the game room that a player has joined so they can add the new player to store
				callback({ status: 'ok', playerId: player.id, gameData: game.getPublicData(), players: game.getPlayersAsArray() });
				//this should take the player to the lobby...
				//maby I will need to run with emitts instead of callback !!??
				//Client will need some info about the game.. (room id n stuff I guess)
			} else {
				//can add reason later if want..
				callback({ status: 'failed' });
				//this should take the player back to start screen or serverlist?... maybe add something in data later so can tell if player came from quickstart or serverlist
			}
		});
		//when player wants to join any open game
		socket.on('quick-play', function (callback) {
			let gameId = '';
			//loop the games map and find open games with player slots left
			for (const [id, game] of games.entries()) {
				if (game.status == 'open' && game.players.size < game.maxPlayers) {
					gameId = game.id;
					break; //no need to continue loop after found one
				}
			}
			//if no game found the empty string from variable init wll be returned
			callback({ gameId });
		});

		//just a testing function so can check on various thins
		socket.on('test', () => {
			console.log(games);
		});

		socket.on('fuu', (gameId) => {
			console.log('got fuu', gameId);
			console.log(socket.id);
			io.to(gameId).emit('player-left');
			io.to(gameId).emit('fuu');
		});
	});

	//should this be in connection?? or is it ok to have it here?.. I dont know when it triggers.. check on later
	io.engine.on('connection_error', (err) => {
		console.log('CONNECTION_ERROR!!');
		console.log(err.req); // the request object
		console.log(err.code); // the error code, for example 1
		console.log(err.message); // the error message, for example "Session ID unknown"
		console.log(err.context); // some additional error context
	});

	function checkStatus(game) {
		//implement later... check status of game and handle stuff accordingly.. maybe round will end..
	}
};
