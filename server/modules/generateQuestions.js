const axios = require('axios');
const he = require('he');
const PickOne = require('../questions/PickOne');
const { shuffleArray } = require('./functions');

module.exports = async function generateQuestions(game) {
	try {
		let url = `https://opentdb.com/api.php?amount=${game.rounds}&type=multiple`;
		if (game.difficulty) url += `&difficulty=${game.difficulty}`;
		if (game.category && game.category !== -1) url += `&category=${game.category}`;
		const { data } = await axios.get(url);

		const selectedQuestions = [];

		data.results.forEach((element) => {
			const answers = shuffleArray(element.incorrect_answers.concat(element.correct_answer));
			answers.forEach((answer, index) => {
				answers[index] = he.decode(answer);
			});
			selectedQuestions.push(new PickOne({ question: he.decode(element.question), answers: answers, correctAnswer: he.decode(element.correct_answer), type: 'pick-one' }));
		});
		return selectedQuestions;
	} catch (error) {
		console.log(error);
		return [];
	}
};
