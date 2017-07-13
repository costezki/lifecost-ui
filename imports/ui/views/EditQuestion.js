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
	'click .make-publish': function(event) {
		// TODO: It is necessary to simplify
		if (event.target.innerText == "visibility_off") {
			event.target.innerText = "visibility";
			event.target.parentNode.parentNode.parentNode.parentNode.published.value = true;
			event.target.parentNode.parentNode.parentNode.parentNode.publishedDate.value = new Date();
		} else {
			event.target.innerText = "visibility_off";
			event.target.parentNode.parentNode.parentNode.parentNode.published.value = false;
			event.target.parentNode.parentNode.parentNode.parentNode.publishedDate.value = null;
		}
	}
});
