const PickOne = require('../questions/PickOne');
module.exports = async function generateQuestions(no) {
	const questions = [
		{ question: 'What is the capital of the United States?', answers: ['Washington', 'New York', 'Los Angeles'], correctAnswer: 'Washington', type: 'pick-one' },
		{ question: 'What is the capital of the United Kingdom?', answers: ['London', 'Manchester', 'Liverpool'], correctAnswer: 'London', type: 'pick-one' },
		{ question: 'What is the capital of the Sweden?', answers: ['Stockholm', 'Oslo', 'Madrid'], correctAnswer: 'Stockholm', type: 'pick-one' },
	];

	//select no random questions from the array
	const selectedQuestions = [];
	for (let i = 0; i < no; i++) {
		const randomIndex = Math.floor(Math.random() * questions.length);

		selectedQuestions.push(new PickOne(questions[randomIndex]));
	}

	return selectedQuestions;
};
