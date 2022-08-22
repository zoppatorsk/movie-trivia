const BaseQuestion = require('./BaseQuestion');
module.exports = class PickOne extends BaseQuestion {
	constructor(...args) {
		super(...args);
	}
	calculateScore(answer, time) {
		if (this.isAnswerCorrect(answer)) return 100 + time * 100;
		else return 0;
	}
};
