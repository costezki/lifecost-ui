import { Questions } from '/imports/collections/questionsCollection';
import { Questionnaires } from '/imports/collections/questionnairesCollection';

import './PublishedQuestions.html';

Template.PublishedQuestions.onCreated(function() {
	Meteor.subscribe('userSettings');
	Meteor.subscribe('questionnaires');
});

Template.PublishedQuestions.onRendered(function() {
	$('ul.tabs').tabs();
});

Template.PublishedQuestions.helpers({
	Questions() {
		return Questions.find();
	},
	questionnaires() {
		return Questionnaires.find();
	}
});

Template.PublishedQuestions.events({
	'click .delete-question': function() {
		let deleteQuestion = confirm("Delete this question?\n\"" + this.question + "\"");

		if (deleteQuestion) {
			Questions.remove(this._id);
		}
	},
	'click .make-publish': function(event) {
		let published = Questions.findOne(this._id);

		if (published.published) {
			Questions.update(this._id, {$set: {published: false, publishedDate: null}});
		} else {
			Questions.update(this._id, {$set: {published: true, publishedDate: new Date()}});
		}
	}
});
