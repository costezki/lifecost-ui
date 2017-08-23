import { Questions } from '/imports/collections/questionsCollection';
import { Answers } from '/imports/collections/answersCollection';

import './ShowAnswers.html';

Template.ShowAnswers.onCreated(function() {
	Meteor.subscribe('answers');
});

Template.ShowAnswers.helpers({
	answers() {
		let answers = Answers.find({author: Meteor.userId()});

		if (answers.count() > 0) {
			let questions = [];
			let questionsIds = [];

			answers.fetch().forEach(function(item, index, array) {
				let latestAnswer = Answers.findOne({
					author: Meteor.userId(),
					questionId: item.questionId
				});

				let question = Questions.findOne(item.questionId);

				if (question !== void 0) {
					let flag = false;

					questionsIds.forEach(function(id) {
						if (item.questionId === id) {
							flag = true;
							return false;
						}
					});

					if (!flag) {
						if (question.answersType === 0) {
							let answer = item.answer.split(',');
							let addedAnswers = [];

							answer.forEach(function(item) {
								addedAnswers.push(question.answers[item]);
							});

							questions.push({
								question: question,
								answer: addedAnswers,
								answerCreatedAt: item.createdAt
							});
						} else if (question.answersType === 1) {
							questions.push({
								question: question,
								answer: question.answers[item.answer],
								answerCreatedAt: item.createdAt
							});
						} else {
							questions.push({
								question: question,
								answer: item.answer,
								answerCreatedAt: item.createdAt
							});
						}
					}
				}
				questionsIds.push(item.questionId);
			});
			return questions;
		}
	}
});
