import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';
import { Answers } from '/imports/collections/answersCollections';

import './Answers.html';

Template.Answers.onCreated(function() {
	AutoForm.addHooks('insertAnswer', {
		// Called when form does not have a `type` attribute
		onSubmit: function(insertDoc, updateDoc, currentDoc) {
			// You must call this.done()!
			this.done(insertDoc); // submitted successfully, call onSuccess
			//this.done(new Error('foo')); // failed to submit, call onError with the provided error
			//this.done(null, "foo"); // submitted successfully, call onSuccess with `result` arg set to "foo"
		},

		// Called when any submit operation succeeds
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
		beginSubmit: function() {},
		endSubmit: function() {}
	}, true);
});

Template.Answers.onRendered(function() {
	Meteor.subscribe('answers');
});

Template.Answers.helpers({
	question() {
		return Questions.findOne(FlowRouter.getParam('id'));
	},
	answer() {
		return Answers.findOne({questionId: FlowRouter.getParam('id')});
	},
	Answers() {
		return Answers;
	},
	answersExists() {
		let answer = Answers.findOne({questionId: FlowRouter.getParam('id')});
		if (answer !== void 0) {
			return true;
		}
	}
});

Template.Answers.events({

});
