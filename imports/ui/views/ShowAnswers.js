import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';
import { Answers } from '/imports/collections/answersCollections';
import { UserSettings } from '/imports/collections/userCollections';

import './ShowAnswers.html';

Template.ShowAnswers.onCreated(function() {
	Meteor.subscribe('answers');
});

Template.ShowAnswers.onRendered(function() {

});

Template.ShowAnswers.helpers({
	answers() {
		let answers = Answers.find({author: Meteor.userId()});
		let questions = [];
		if (answers.fetch().length > 0) {
			answers.fetch().forEach(function(item, index, array) {
					let question = Questions.findOne(item.questionId);
					if (question !== void 0) {
						questions.push(question);
					}
			});
			return questions;
		}
	}
});

Template.ShowAnswers.events({

});
