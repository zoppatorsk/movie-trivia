const axios = require('axios');
const he = require('he');
const PickOne = require('../questions/PickOne');
module.exports = async function generateQuestions(no) {
	try {
		const { data } = await axios.get(`https://opentdb.com/api.php?amount=${no}&type=multiple`);

		const selectedQuestions = [];

		data.results.forEach((element) => {
			selectedQuestions.push(new PickOne({ question: he.decode(element.question), answers: element.incorrect_answers.concat(element.correct_answer), correctAnswer: element.correct_answer, type: 'pick-one' }));
		});
		return selectedQuestions;
	} catch (error) {
		console.log(error);
		return [];
	}
};
