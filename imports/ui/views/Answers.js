import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';
import { Answers } from '/imports/collections/answersCollections';

import './Answers.html';

Template.Answers.onCreated(function() {
	Meteor.subscribe('answers');
	AutoForm.addHooks('insertAnswer', {
		onSubmit: function(insertDoc, updateDoc, currentDoc) {
			this.done(insertDoc); // submitted successfully, call onSuccess
		},
		onSuccess: function(formType, result) {
			let question = Questions.findOne(FlowRouter.getParam('id'));
			if (question !== void 0) {
				let questionText = question.question;
				let description = question.description;
				let questionId = question._id;
				let authorWhoCreated = question.author;

				Answers.update(
					result,
					{
						$set:{
							question: questionText,
							description: description,
							questionId: questionId,
							authorWhoCreated: authorWhoCreated
						},
					}
				);
			}

		},
	}, true);
});

Template.Answers.onRendered(function() {

});

Template.Answers.helpers({
	question() {
		return Questions.findOne(FlowRouter.getParam('id'));
	},
	answer() {
		let answers = Answers.find({author: Meteor.userId(), questionId: FlowRouter.getParam('id')});
		let answer = answers.fetch()[answers.fetch().length - 1];
		if (answer !== void 0) {
			let question = Questions.findOne({_id: answer.questionId});

			if (question !== void 0) {
				if (question.answersType !== 2) {
					return question.answers[answer.answersType];
				} else {
					return answer.answersType;
				}
			}
		}
	},
	Answers() {
		return Answers;
	}
});

Template.Answers.events({

});
