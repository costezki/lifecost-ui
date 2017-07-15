import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';
import { Answers } from '/imports/collections/answersCollections';

import './MyAnswers.html';

Template.MyAnswers.onCreated(function() {
	Meteor.subscribe('answers');
});

Template.MyAnswers.onRendered(function() {

});

Template.MyAnswers.helpers({

});

Template.MyAnswers.events({

});

Template.registerHelper('getDate', function(date) {
	return moment(date).format("MMM Do YYYY, h:mm:ss a");
});

Template.registerHelper('getAuthor', function(author) {
	let user = Meteor.users.findOne(author);
	if (user !== void 0) return user.username;
});

Template.registerHelper('checkUser', function(user) {
	if (user !== Meteor.userId()) {
		return true;
	} else {
		return false;
	}
});
