const axios = require('axios');
const he = require('he');
const PickOne = require('../questions/PickOne');
const { shuffleArray } = require('./functions');

module.exports = async function generateQuestions(no) {
	try {
		const { data } = await axios.get(`https://opentdb.com/api.php?amount=${no}&type=multiple`);

		const selectedQuestions = [];

		data.results.forEach((element) => {
			const answers = shuffleArray(element.incorrect_answers.concat(element.correct_answer));
			selectedQuestions.push(new PickOne({ question: he.decode(element.question), answers: answers, correctAnswer: element.correct_answer, type: 'pick-one' }));
		});
		return selectedQuestions;
	} catch (error) {
		console.log(error);
		return [];
	}
};
