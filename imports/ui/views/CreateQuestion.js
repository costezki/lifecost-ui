import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';

import './CreateQuestion.html';

Template.CreateQuestion.onCreated(function() {

});

Template.CreateQuestion.onRendered(function() {
	$('input#question-title, textarea#question-desc').characterCounter();
});

Template.CreateQuestion.helpers({
	Questions() {
		return Questions;
	}
});

Template.CreateQuestion.events({

});
