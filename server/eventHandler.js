const Game = require('./Game');
const Player = require('./Player');
const { disconnecting, quickPlay, countDownToRoundStart, countDownRound } = require('./modules/functions');
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

		socket.on('player-ready', (gameId) => {
			const game = games.get(gameId);

			//maybe we need to do something here later except reurn but probably not, this is a safeguard if socket reconnects n start sending shit when game is in another state
			if (game.status !== 'open' && game.status !== 'waiting-for-start') return;

			//when player is ready shld.. change the ready variable of player
			game.players.get(socket.id).ready = true;
			if (game.status !== 'waiting-for-start') game.status = 'waiting-for-start'; //now we do not accept any new players

			//if half of players are not ready then just return
			if (game.howManyPlayersReady() < game.players.size / 2) return;
			//here shld run a function that is reused everytime a new round starts
			getReady(io, game);
		});

		socket.on('player-ready-round', (gameId) => {
			const game = games.get(gameId);
			if (game.status !== 'get-ready' && game.status !== 'waiting-for-ready') return;
			if (game.status !== 'waiting-for-ready') game.status = 'waiting-for-ready';
			game.players.get(socket.id).ready = true;
			if (game.howManyPlayersReady() !== game.players.size) return;
			game.status = 'waiting-for-answer';
			io.to(gameId).emit('round-start');
			game.startRoundCountDown(io, endRound);
		});

		socket.on('answer', (gameId, answer) => {
			const game = games.get(gameId);
			if (game.status !== 'waiting-for-answer') return;
			//store the answer.. for now it's stored in the game object as an object
			game.answers[game.round][socket.id] = answer;
			//check if all players have answered
			if (game.allPlayersHaveAnswered() == false) return;
			//clear the interval for counting down as we now ends the round as all players have answered
			game.clearRoundCountDown();
			//run endRound logic
			endRound(io, game);
		});

		socket.on('test', () => {
			console.log(games);
		});

		io.engine.on('connection_error', (err) => {
			console.log('CONNECTION_ERROR!!');
			console.log(err.req); // the request object
			console.log(err.code); // the error code, for example 1
			console.log(err.message); // the error message, for example "Session ID unknown"
			console.log(err.context); // some additional error context
		});
	});
};

function getReady(io, game) {
	game.status = 'get-ready';
	game.resetPlayerReady();
	let count = game.waitBetweenRounds + 1;
	const counter = setInterval(countdown, 1000, game.id);

	function countdown(gameId) {
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
