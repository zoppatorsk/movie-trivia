const { nanoid } = require('nanoid');

module.exports = class Game {
	constructor({ maxPlayers = 5, rounds = 3 } = {}) {
		this.id = nanoid();
		this.maxPlayers = maxPlayers;
		this.rounds = rounds;
		this.round = 1;
		this.waitBetweenRounds = 5;
		//this.waitBetweenRounds = 2;
		this.roundTime = 30;
		this.currentRoundTime = this.roundTime; //this is used to keep track of the time left in the round and only used for scoring system, counts down with round.
		this.status = 'open';
		this.players = new Map();
		this.roundCountDown = null; //will hold the interval timer for the round
		this.questions = [];
		this.name = 'Game';
	}

	startRoundCountDown(io, func) {
		this.currentRoundTime = this.roundTime; //reset the current round time so will be accurate when starting the round
		let count = this.roundTime + 1;

		const countDown = () => {
			if (!this || this.players.size < 1) clearInterval(this.roundCountDown); //safe guard so interval is cleared if game is deleted
			count--;
			this.currentRoundTime = count;

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

	getNextQuestion() {
		return this.questions[this.round - 1];
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

	// addDnaIfNeeded() {
	// 	this.players.forEach((player) => {
	// 		console.log('a', player.answers);
	// 		console.log('round', this.round);
	// 		if (!player.answers[this.round - 1]) player.answers[this.round - 1] = 'DNA';
	// 	});
	// }
	addAnswerForDNA() {
		this.players.forEach((player) => {
			if (!player.answers[this.round - 1]) player.answers[this.round - 1] = { answer: '', correct: false, time: null, score: 0 };
		});
	}

	compileAnswers() {
		//later add correct answer n transform compiled answer into object instead
		//just let this function be responsible for all the needed stuff n not split logic between game loop and game class
		this.addAnswerForDNA();
		let playerAnswers = new Map(); //create a map as will be easier to deal with on frontend
		this.players.forEach((player) => {
			const playerAnswer = player.answers[this.round - 1];
			playerAnswers.set(player.id, playerAnswer);
		});
		//transform map into array so can be sent to frontend (cant send Map over socket)
		playerAnswers = Array.from(playerAnswers);
		const compiledAnswers = {};
		//put in some more junk.
		compiledAnswers.answers = playerAnswers;
		compiledAnswers.round = this.round;
		compiledAnswers.correctAnswer = this.questions[this.round - 1].correctAnswer;

		return compiledAnswers;
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
			if (player.answers[this.round - 1] !== undefined) {
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
		//overhaul later so only send info needed.
		this.players.forEach((player) => {
			playersArr.push({ ...player });
		});
		return playersArr;
	}

	compileResults() {
		//what shld i really send??
		let results = {};
		results.lastRound = this.compileAnswers(); //last round answers
		let score = new Map();
		//add score from all rounds into score set with player id as key and score as value
		this.players.forEach((player) => {
			score.set(
				player.id,
				player.answers.map((a) => a.score).reduce((a, b) => a + b) //map to array and reduce into a single value
			);
		});
		results.score = Array.from(score); //transform map into array so can be sent to frontend (cant send Map over socket)
		return results;
	}
};
