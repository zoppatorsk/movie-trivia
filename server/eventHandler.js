const Game = require('./Game');
const Player = require('./Player');
const { quickPlay } = require('./modules/functions');
const generateQuestions = require('./modules/generateQuestions');
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

		socket.on('leave-room', (gameid) => {
			if (gameid) {
				disconnecting(io, socket, games); //leave the game n do cleanup if needed
				socket.leave(gameid); //leave socket room
			}
		});

		socket.on('game-chat', (msg, gameid) => socket.to(games.get(gameid).id).emit('game-chat', msg));
		//socket.on('global-chat', (msg, name) => socket.broadcast.emit('global-chat', msg, name, avatar));
		socket.on('global-chat', (msg, name) => socket.broadcast.emit('global-chat', msg));

		socket.on('get-game-list', function (callback) {
			const gameList = [];
			for (const [id, game] of games.entries()) {
				if (game.status == 'open' && game.players.size < game.maxPlayers) {
					gameList.push({ id: game.id, name: game.name, players: game.players.size, maxPlayers: game.maxPlayers, rounds: game.rounds });
				}
			}
			console.log(gameList);
			callback(gameList);
		});

		//data should hold player details n game settings, just omitt for now and run on default settings
		socket.on('create-game', async function (data, callback) {
			console.log('d', data);
			const game = new Game(data?.settings); //create the game
			const player = new Player({ id: socket.id, name: data.name, avatar: `https://avatars.dicebear.com/api/avataaars/:${data.avatar}.svg` }); //create the player
			game.join(player); //add the player to the game
			games.set(game.id, game); //store the game in the games map
			socket.join(game.id); //join the socket into a room for the game.. roomname is same as game.id

			//-----here we should create the questions that the game will use
			game.questions = await generateQuestions(game);
			console.log(game.questions);
			//this should take the player to the lobby.
			callback({ status: 'ok', playerId: player.id, gameData: game.getPublicData(), players: game.getPlayersAsArray() });

			//later add a failed callback if game fails to create, ie. no questions found
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
			if (game.status !== 'waiting-for-start') game.status = 'waiting-for-start';
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
			const player = game?.players?.get(socket.id);
			if (game.status !== 'waiting-for-answer') return;
			if (player.answers[game.round - 1]) return; //if player has already answered then return

			const question = game.questions[game.round - 1];

			//set the answer for the player

			player.answers[game.round - 1] = {
				answer,
				correct: question.isAnswerCorrect(answer),
				score: question.calculateScore(answer, game.currentRoundTime),
			};

			shouldEndRound(io, game);
		});

		socket.on('test', () => {
			console.log('g', games);
			console.log('rooms', io.sockets.adapter.rooms);
		});
	});
};

function getReady(io, game) {
	game.status = 'get-ready';
	game.resetPlayerReady();
	let count = game.waitBetweenRounds + 1;
	let counter;

	const countdown = (gameId) => {
		if (!games.get(gameId) || games.get(gameId).players.size < 1) clearInterval(counter); //if game has been deleted or no players then stop the countdown
		count--;

		io.to(gameId).emit('count-down', count);
		if (count == 0) {
			clearInterval(counter);
			io.to(gameId).emit('ready-round', games.get(gameId)?.getNextQuestion());
		}
	};
	countdown(game.id); //run the countdown once so do not have to wait 1 sec before counter starting
	counter = setInterval(countdown, 1000, game.id);
}

function endRound(io, game) {
	//this code shld be in a function as it will also need to be run if not all have answered and time runs out

	if (game.round == game.rounds) {
		game.status = 'end-game';
		io.to(game.id).emit('end-game', game.compileResults());
		games.delete(game.id);
	} else {
		game.status = 'end-round';
		const playerAnswers = game.compileAnswers();
		io.to(game.id).emit('end-round', game.compileResults());
		game.round++;
		getReady(io, game);
	}
}

function shouldGameStart(io, game) {
	//if less than half of players are not ready then just return
	if (game.howManyPlayersReady() == 0) game.status = 'open';
	if (game.howManyPlayersReady() < game.players.size / 2) return;
	getReady(io, game);
}

function shouldStartRound(io, game) {
	if (game.howManyPlayersReady() !== game.players.size) return; //if not all players are ready then return
	game.status = 'waiting-for-answer';
	io.to(game.id).emit('round-start'); //start round
	game.startRoundCountDown(io, endRound); //start the round countdown
}

function shouldEndRound(io, game) {
	if (game.allPlayersHaveAnswered() == false) return;
	game.clearRoundCountDown(); //clear the interval for counting down as we now ends the round as all players have answered

	endRound(io, game); //run endRound logic
}

function disconnecting(io, socket, games) {
	//check if player is in a game and if so remove them from the game..
	if (socket.rooms.size < 2) return;
	for (const room of socket.rooms) {
		//seems stuff can be undefined for some time so added a check for this too.
		if (room == socket.id || games.get(room) == undefined) continue;
		const game = games.get(room);
		game?.leave(socket.id);

		//delete room if empty
		if (game?.players.size === 0) games.delete(room);
		else {
			//notify the other players that the player has left the game
			socket.to(game.id).emit('player-left', socket.id);
			//-----chek the state of the game and run needed function
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
