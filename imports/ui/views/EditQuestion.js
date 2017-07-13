import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';

import './EditQuestion.html';

Template.EditQuestion.onCreated(function() {

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
