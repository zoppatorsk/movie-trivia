const Game = require('./Game');
const Player = require('./Player');
const { disconnecting, quickPlay } = require('./modules/functions');
const games = new Map(); //use a map to store all the games so can easily access them by id

module.exports = function (io) {
	io.on('connection', function (socket) {
		const count = io.engine.clientsCount;
		console.log(socket.id + ' connected c:' + count); //just for debugging purposes

		//use disconnecting instead of discconnect so still have access to room of socket n stuff
		socket.on('disconnecting', () => {
			disconnecting(io, socket, games);
			console.log(socket.id + ' disconnecting');
		});

		//data should hold player details n game settings, just omitt for now and run on default settings
		socket.on('create-game', function (data, callback) {
			const game = new Game(); //create the game
			const player = new Player({ id: socket.id }); //create the player
			game.join(player); //add the player to the game
			games.set(game.id, game); //store the game in the games map
			socket.join(game.id); //join the socket into a room for the game.. roomname is same as game.id

			//-----here we should create the questions that the game will use

			//this should take the player to the lobby.
			callback({ status: 'ok', playerId: player.id, gameData: game.getPublicData(), players: game.getPlayersAsArray() });
		});

		//when a player want to joins a game
		socket.on('join-game', function (data, callback) {
			const { gameId } = data; //data shld be like { player: { name: '', etc.. }, gameid: '' }
			const game = games.get(gameId);
			const player = new Player({ id: socket.id }); //create player

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

		//just a testing function so can check on various thins
		socket.on('test', () => {
			console.log(games);
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
