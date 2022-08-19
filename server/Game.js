const { nanoid } = require('nanoid');

module.exports = class Game {
	constructor({ maxPlayers = 5, rounds = 3 } = {}) {
		this.id = nanoid();
		this.maxPlayers = maxPlayers;
		this.rounds = rounds;
		this.round = 1;
		this.status = 'open';
		this.players = new Map();
	}

	join(player) {
		//check if plyer is allowed to join
		if (this.status === 'open' && this.players.size < this.maxPlayers) {
			this.players.set(player.id, player);
			return true;
		}
		return false;
	}

	leave(playerid) {
		this.players.delete(playerid);
	}
	getPublicData() {
		return {
			id: this.id,
			round: this.round,
			rounds: this.rounds,
			status: this.status,
		};
	}

	//easier to do stuff on front with players as an array instead of a map
	getPlayersAsArray() {
		let playersArr = [];
		//convert the players map to an array.. this could probably be done cleaner and in one line but I am not used to working with maps
		this.players.forEach((player) => {
			playersArr.push({ ...player });
		});
		return playersArr;
	}
};
