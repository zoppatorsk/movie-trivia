module.exports = class BaseQuestion {
	constructor({ type = 'pic-one', title = 'pick one', question = 'question text', correctAnswer = 'correct answer', answers = ['correct answer', 'wrong answer'] } = {}) {
		if (this.constructor == BaseQuestion) throw new Error("Abstract classes can't be instantiated.");

		this.type = type;
		this.title = title;

		this.question = question; //question text
		this.correctAnswer = correctAnswer; //correct answer
		this.answers = answers; //array of answer alternatives
	}

	isAnswerCorrect(answer) {
		return answer == this.correctAnswer;
	}
	calculateScore(answer, time) {
		if (this.isAnswerCorrect(answer)) return 500 + time * 10;
		else return 0;
	}
};
