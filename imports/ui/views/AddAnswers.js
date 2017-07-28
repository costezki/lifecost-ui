import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';
import { Answers, AnswersSchema } from '/imports/collections/answersCollections';
import { setAnswerId } from '/imports/mdg/methods';

import './AddAnswers.html';

Template.AddAnswers.onCreated(function() {
	Meteor.subscribe('answers');
	AutoForm.addHooks('insertAnswer', {
		onSubmit: function(insertDoc, updateDoc, currentDoc) {
			this.done(insertDoc); // submitted successfully, call onSuccess
		},
		onSuccess: function(formType, answerId) {
			let questionId = FlowRouter.getParam('id');
			Answers.update(
				answerId,
				{
					$set:{
						questionId: questionId
					},
				}
			);
		},
	}, true);
});

Template.AddAnswers.onRendered(function() {

});

Template.AddAnswers.helpers({
	question() {
		let question = Questions.findOne(FlowRouter.getParam('id'));

		if (question !== void 0) {
			if (question.published) {
				return question;
			} else {
				if (question.deprecated) {
					return question;
				} else {
					FlowRouter.go('/published-questions');
				}
			}
		}
	},
	answer() {
		let answers = Answers.find({author: Meteor.userId(), questionId: FlowRouter.getParam('id')});

		if (answers.count() > 0) {
			let answer = answers.fetch()[answers.count() - 1];
			let question = Questions.findOne({_id: answer.questionId});

			if (question !== void 0) {
				let answerType = question.answersType;
				if (answerType == 0) {
					let selectedAnsers = [];

					answer.answer.forEach(function(item) {
						selectedAnsers.push(question.answers[item])
					});

					return selectedAnsers;
				} else if (answerType == 1) {
					return question.answers[answer.answer];
				} else {
					return answer.answer;
				}
			}
		}
	},
	answersSchema() {
		let question = Questions.findOne(FlowRouter.getParam('id'));

		if (question !== void 0) {
			let answerType = question.answersType;

			if (answerType == 0) {
				return AnswersSchema.checkboxType;
			} else if (answerType == 1) {
				return AnswersSchema.radioButtonType;
			} else {
				return AnswersSchema.textType;
			}
		}
	},
	Answers() {
		return Answers;
	}
});

Template.AddAnswers.events({

});
