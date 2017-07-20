import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';

import './EditQuestion.html';

Template.EditQuestion.onCreated(function() {
	AutoForm.addHooks('updateQuestion', {
		onSuccess: function(formType, result) {
			FlowRouter.go('/questions');
		},
		formToModifier: function(modifier) {
			console.log(modifier);
			// return modifier;
		},
		formToDoc: function(doc) {
			if (doc.answersType == 2) {
				$('#updateQuestion').find('.collection').css('display', 'none');
			} else {
				$('#updateQuestion').find('.collection').css('display', 'inherit');
			}
			return doc;
		}
	}, true);
});

Template.EditQuestion.onRendered(function() {
	$('input#question-title, textarea#question-desc').characterCounter();
});

Template.EditQuestion.helpers({
	Question() {
		let question = Questions.findOne({_id: FlowRouter.getParam('id')});
		if (question !== void 0) {
			return question;
		}
	},
	Questions() {
		return Questions;
	}
});

Template.EditQuestion.events({

});
