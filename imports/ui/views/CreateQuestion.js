import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';

import './CreateQuestion.html';

Template.CreateQuestion.onCreated(function() {

});

Template.CreateQuestion.onRendered(function() {
	$('input#question-title, textarea#question-desc').characterCounter();

	$('.tooltipped').tooltip(
		{
			delay: 50,
			tooltip: 'Add to publish page',
			position: 'top'
		}
	);
});

Template.CreateQuestion.helpers({
	Questions() {
		return Questions;
	}
});

Template.CreateQuestion.events({
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
