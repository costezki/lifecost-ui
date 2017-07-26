import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';
import { Answers } from '/imports/collections/answersCollections';

import './ShowAnswers.html';

Template.ShowAnswers.onCreated(function() {
	Meteor.subscribe('answers');
});

Template.ShowAnswers.onRendered(function() {

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
						if (item.questionId == id) {
							flag = true;
							return false;
						}
					});

					if (!flag) {
						questions.push(question);
					}
				}
				questionsIds.push(item.questionId);
			});
			return questions;
		}
	}
});

Template.ShowAnswers.events({

});
