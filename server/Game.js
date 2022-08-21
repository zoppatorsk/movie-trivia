const { nanoid } = require('nanoid');

module.exports = class Game {
	constructor({ maxPlayers = 5, rounds = 2 } = {}) {
		this.id = nanoid();
		this.maxPlayers = maxPlayers;
		this.rounds = rounds;
		this.round = 1;
		this.waitBetweenRounds = 5;
		this.roundTime = 30;
		this.currentRoundTime = this.roundTime; //this is used to keep track of the time left in the round and only used for scoring system
		this.status = 'open';
		this.players = new Map();
		this.roundCountDown = null; //will hold the interval timer for the round
		this.answers = { 1: {}, 2: {}, 3: {} }; //for now just store answers here in hardcoded way, probably wld be better if stored in player object.
	}

	startRoundCountDown(io, func) {
		this.currentRoundTime = this.roundTime; //reset the current round time so will be accurate when starting the round
		let count = this.roundTime + 1;

		const countDown = () => {
			console.log(this);
			if (!this || this.players.size < 1) clearInterval(this.roundCountDown); //safe guard so interval is cleared if game is deleted
			count--;
			this.currentRoundTime = count;
			console.log(count);
			io.to(this.id).emit('count-down', count);
			if (count === 0) {
				this.clearRoundCountDown();
				func(io, this);
			}
		};

		countDown(); //run function once so do not have to wait for interval to start (i.e. no 1 second delay before first emit)
		this.roundCountDown = setInterval(countDown, 1000);
	}

	clearRoundCountDown() {
		clearInterval(this.roundCountDown);
		this.roundCountDown = null;
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

	resetPlayerReady() {
		this.players.forEach((player) => {
			player.ready = false;
		});
	}
	howManyPlayersReady() {
		let ready = 0;
		this.players.forEach((player) => {
			if (player.ready) ready++;
		});
		return ready;
	}
	allPlayersHaveAnswered() {
		let noAnswers = 0;
		this.players.forEach((player) => {
			if (this.answers?.[this.round]?.[player.id] !== undefined) {
				noAnswers++;
			}
		});
		return noAnswers === this.players.size;
	}

	getPublicData() {
		return {
			id: this.id,
			round: this.round,
			rounds: this.rounds,
			waitBetweenRound: this.waitBetweenRounds,
			roundTime: this.roundTime,
			status: this.status,
		};
	}

	//easier to do stuff on frontend with players as an array instead of a map
	getPlayersAsArray() {
		let playersArr = [];
		//convert the players map to an array.. this could probably be done cleaner and in one line but I am not used to working with maps
		//this will probably be overhauled later
		this.players.forEach((player) => {
			playersArr.push({ ...player });
		});
		return playersArr;
	}

	compileResults() {
		//later use this to compile the results of the game
		return {};
	}
};
