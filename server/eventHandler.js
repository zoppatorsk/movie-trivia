const Game = require('./Game');
const Player = require('./Player');

module.exports = function (io) {
	const games = new Map(); //use a map to store all the games so can easily access them by id

	io.on('connection', function (socket) {
		const count = io.engine.clientsCount;
		console.log(socket.id + ' connected c:' + count);

		socket.on('disconnecting', () => {
			//check if player is in a game and if so remove them from the game.. so we check if size of rooms are larger than 1
			if (socket.rooms.size > 1) {
				for (const room of socket.rooms) {
					if (room !== socket.id) {
						games.get(room).leave(socket.id);
						//delete room if empty
						if (games.get(room).players.size === 0) games.delete(room);
						else {
							//notify the other players that the player has left the game
							//chek the state of the game and finish round if all other playeres have asnwered
						}
						break;
					}
				}
			}
			console.log(socket.id + ' disconnected');
		});

		//when player have selected his settings and game should be created.. data should hold the settings, just omitt for now and run on default settings
		socket.on('create-game', function (data, callback) {
			console.log('create-game');

			//create the game
			const game = new Game();

			//store the id
			const gameid = game.id;

			//create the player.. later add junk like name n such.
			const player = new Player({ id: socket.id });

			//add the player to the game
			game.join(player);

			//store the game in the games map
			games.set(game.id, game);

			//join the socket into a room for the game.. roomname is same as gameid
			socket.join(gameid);

			//-----here we should create the questions that the game will use

			//callback to the client that the game has been created
			//this should take the player to the lobby.
			callback({ status: 'ok' });
		});

		//when a player want to joins a game
		socket.on('join-game', function (data, callback) {
			console.log('join-game');
			//data shld be like { player: { name: '', etc.. }, gameid: '' }

			//check the game status n stuff so it is ok to join
			const game = games.get(data.gameid);

			//create player
			const player = new Player({ id: socket.id });
			//try to join the game
			const successfulJoin = game.join(player);
			//if ok then join socket room
			if (successfulJoin) {
				socket.join(data.gameid);
				callback({ status: 'ok' });
				//this should take the player to the lobby...
				//maby I will need to run with emitts instead of callback !!??
				//I also guess the client will need some info about the game?? .. this will show later i guess..!!
			} else {
				//can add reason later if want..
				callback({ status: 'failed' });
				//this should take the player to start screen or serverlist?... maybe add something in data later so can tell if player came from quickstart or serverlist
			}
		});

		//just a testing function so can check on various thins
		socket.on('test', () => {
			console.log(games);
		});

		// io.of('/').adapter.on('leave-room', (room) => {
		// 	//dont use.. gets triggerd on all sockets..

		// 	console.log(`room ${room} was leaved`);
		// });
	});

	//should this be in connection?? or is it ok to have it here?.. I dont know when it triggers.. check on later
	io.engine.on('connection_error', (err) => {
		console.log('CONNECTION_ERROR!!');
		console.log(err.req); // the request object
		console.log(err.code); // the error code, for example 1
		console.log(err.message); // the error message, for example "Session ID unknown"
		console.log(err.context); // some additional error context
	});
};

function findPlayersGame(id) {}
