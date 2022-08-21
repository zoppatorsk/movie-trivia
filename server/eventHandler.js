const Game = require('./Game');
const Player = require('./Player');
const { quickPlay } = require('./modules/functions');
const games = new Map(); //use a map to store all the games so can easily access them by id

module.exports = function (io) {
	io.on('connection', function (socket) {
		const count = io.engine.clientsCount;
		console.log(socket.id + ' connected c:' + count); //just for debugging purposes

		//use disconnecting instead of discconnect so still have access to room of socket n stuff
		socket.on('disconnecting', () => {
			disconnecting(io, socket, games); //abstracted away the code into a function
			console.log(socket.id + ' disconnecting');
		});

		//data should hold player details n game settings, just omitt for now and run on default settings
		socket.on('create-game', function (data, callback) {
			const game = new Game(); //create the game
			const player = new Player({ id: socket.id, name: data.name, avatar: `https://avatars.dicebear.com/api/avataaars/:${data.avatar}.svg` }); //create the player
			game.join(player); //add the player to the game
			games.set(game.id, game); //store the game in the games map
			socket.join(game.id); //join the socket into a room for the game.. roomname is same as game.id

			//-----here we should create the questions that the game will use

			//this should take the player to the lobby.
			callback({ status: 'ok', playerId: player.id, gameData: game.getPublicData(), players: game.getPlayersAsArray() });
		});

		//when a player want to joins a game
		socket.on('join-game', function (data, callback) {
			const { gameId } = data;
			const game = games.get(gameId);
			const player = new Player({ id: socket.id, name: data.name, avatar: `https://avatars.dicebear.com/api/avataaars/:${data.avatar}.svg` }); //create player
			const successfullJoin = game.join(player); //try to join the game
			if (successfullJoin) {
				socket.join(gameId);
				socket.to(game.id).emit('player-joined', player); //emit to the game room that a player has joined so they can add the new player to store
				callback({ status: 'ok', playerId: player.id, gameData: game.getPublicData(), players: game.getPlayersAsArray() });
			} else {
				callback({ status: 'failed' }); //can add reason later if want..
				//this should take the player back to start screen or serverlist?... maybe add something in data later so can tell if player came from quickstart or serverlist.
			}
		});

		//when player wants to join any open game
		socket.on('quick-play', function (callback) {
			const gameId = quickPlay(games);
			callback({ gameId });
		});

		socket.on('player-ready', (gameId) => {
			const game = games.get(gameId);

			//maybe we need to do something here later except reurn but probably not, this is a safeguard if socket reconnects n start sending shit when game is in another state
			if (game.status !== 'open' && game.status !== 'waiting-for-start') return;

			//when player is ready shld.. change the ready variable of player
			game.players.get(socket.id).ready = true;
			if (game.status !== 'waiting-for-start') game.status = 'waiting-for-start'; //now we do not accept any new players

			shouldGameStart(io, game);
		});

		socket.on('player-ready-round', (gameId) => {
			const game = games.get(gameId);
			if (game.status !== 'get-ready' && game.status !== 'waiting-for-ready') return;
			if (game.status !== 'waiting-for-ready') game.status = 'waiting-for-ready';
			game.players.get(socket.id).ready = true;
			shouldStartRound(io, game);
		});

		socket.on('answer', (gameId, answer) => {
			const game = games.get(gameId);
			if (game.status !== 'waiting-for-answer') return;
			//store the answer.. for now it's stored in the game object as an object
			game.answers[game.round][socket.id] = answer;
			shouldEndRound(io, game);
		});

		socket.on('test', () => {
			console.log(games);
		});
	});
};

function getReady(io, game) {
	game.status = 'get-ready';
	game.resetPlayerReady();
	let count = game.waitBetweenRounds + 1;
	const counter = setInterval(countdown, 1000, game.id);

	function countdown(gameId) {
		if (!games.get(gameId) || games.get(gameId).players.size < 1) clearInterval(counter); //if game has been deleted or no players then stop the countdown
		count--;
		console.log(count);
		io.to(gameId).emit('count-down', count);
		if (count == 0) {
			clearInterval(counter);
			io.to(gameId).emit('ready-round'); //here neeed to send with some junk later.. like question n metadata about it
		}
	}
}

function endRound(io, game) {
	//this code shld be in a function as it will also need to be run if not all have answered and time runs out
	game.round++;
	if (game.round > game.rounds) {
		game.status = 'end-game';
		io.to(game.id).emit('end-game', game.compileResults());
		games.delete(game.id);
	} else {
		game.status = 'end-round';
		io.to(game.id).emit('end-round'); //need to send with some reuslts oater
		getReady(io, game);
	}
}

function shouldGameStart(io, game) {
	//if half of players are not ready then just return
	if (game.howManyPlayersReady() < game.players.size / 2) return;
	getReady(io, game);
}

function shouldStartRound(io, game) {
	if (game.howManyPlayersReady() !== game.players.size) return;
	game.status = 'waiting-for-answer';
	io.to(game.id).emit('round-start');
	game.startRoundCountDown(io, endRound);
}

function shouldEndRound(io, game) {
	if (game.allPlayersHaveAnswered() == false) return;
	//clear the interval for counting down as we now ends the round as all players have answered
	game.clearRoundCountDown();
	//run endRound logic
	endRound(io, game);
}

function disconnecting(io, socket, games) {
	//check if player is in a game and if so remove them from the game..
	if (socket.rooms.size > 1) {
		for (const room of socket.rooms) {
			//seems a room can be undefined for a period of time, so had to check for that too
			if (room !== socket.id && games.get(room) !== undefined) {
				const game = games.get(room);
				game?.leave(socket.id);

				//delete room if empty
				if (game?.players.size === 0) games.delete(room);
				else {
					//notify the other players that the player has left the game
					io.to(game.id).emit('player-left', socket.id);
					//-----chek the state of the game and finish round if all other playeres have asnwered
					switch (game.status) {
						case 'waiting-for-start':
							shouldGameStart(io, game);
							break;
						case 'waiting-for-ready':
							shouldStartRound(io, game);
							break;
						case 'waiting-for-answer':
							shouldEndRound(io, game);
							break;
					}
				}
				break;
			}
		}
	}
}
