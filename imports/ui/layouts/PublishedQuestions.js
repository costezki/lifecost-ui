import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';

import './PublishedQuestions.html';

Template.PublishedQuestions.onCreated(function() {

});

Template.PublishedQuestions.onRendered(function() {

});

Template.PublishedQuestions.helpers({
	Questions() {
		return Questions.find();
	}
});

Template.PublishedQuestions.events({
	'click .delete-question': function() {
		var deleteQuestion = confirm("Delete this question?\n\"" + this.question + "\"");

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

Template.registerHelper('getDate', function(date) {
	return moment(date).format("MMM Do YYYY, h:mm:ss a");
});

Template.registerHelper('getAuthor', function(author) {
	return Meteor.users.findOne(author).username;
});

Template.registerHelper('checkUser', function(user) {
	if (user !== Meteor.userId()) {
		return true;
	} else {
		return false;
	}
});
