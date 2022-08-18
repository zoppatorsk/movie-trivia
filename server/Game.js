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
};
