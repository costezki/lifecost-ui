import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';

import './MyQuestions.html';

Template.MyQuestions.onCreated(function() {
	Meteor.subscribe('questions');
});

Template.MyQuestions.onRendered(function() {

});

Template.MyQuestions.helpers({
	questionsLength() {
		return Questions.find({author: Meteor.userId()}).fetch().length;
	},
	Questions() {
		return Questions.find({author: Meteor.userId()});
	}
});

Template.MyQuestions.events({
	'click .delete-question': function() {
		var deleteQuestion = confirm("Delete this question?\n\"" + this.question + "\"");

		if (deleteQuestion) {
			Questions.remove(this._id);
		}
	}
});
