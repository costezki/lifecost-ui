import { Questions } from '/imports/collections/questionsCollection';

import './CreateQuestion.html';

Template.CreateQuestion.onCreated(function() {
	AutoForm.addHooks('createQuestion', {
		onSuccess: function() {
			FlowRouter.go('/questions');
		},
		formToDoc: function(doc) {
			if (doc.answersType === 2) {
				$('#createQuestion').find('.collection').css('display', 'none');
			} else {
				$('#createQuestion').find('.collection').css('display', 'inherit');
			}
			return doc;
		}
	}, true);
});

Template.CreateQuestion.onRendered(function() {
	$('input#question-title, textarea#question-desc').characterCounter();

	$('.tooltipped').tooltip({
		delay: 50,
		tooltip: 'Add to publish page',
		position: 'top'
	});
});

Template.CreateQuestion.helpers({
	Questions() {
		return Questions;
	}
});

Template.CreateQuestion.events({
	'click .make-publish': function(event) {
		// TODO: It is necessary to simplify
		if (event.target.innerText === "visibility_off") {
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
