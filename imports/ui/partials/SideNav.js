import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';
import { Answers } from '/imports/collections/answersCollections';
import { UserSettings } from '/imports/collections/userCollections';

import './SideNav.html';

Template.SideNav.onCreated(function() {
	Meteor.subscribe('questions');
	Meteor.subscribe('answers');
	Meteor.subscribe('userSettings');
});

Template.SideNav.onRendered(function() {
	/** Modals **/
	$('.modal').modal({
		complete: function() {
			$('.collapsible-header').removeClass(function(){
				return 'active';
			});
			$('.collapsible').collapsible({accordion: true});
			$('.collapsible').collapsible({accordion: false});
		} // Callback for Modal closeA
	});

	/** Collapsible blocks **/
	$('.collapsible').collapsible({
		accordion: false, // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		onOpen: function(el) { console.log(el); }, // Callback for Collapsible open
		onClose: function(el) { console.log(el); } // Callback for Collapsible close
	});

	$('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: false, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'right', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false // Stops event propagation
      }
    );
});

Template.SideNav.helpers({
	userSettings() {
		return UserSettings.findOne({user: Meteor.userId()});
	},
	questionsLength() {
		return Questions.find({author: Meteor.userId()}).fetch().length;
	},
	myAnswers() {
		let answers = Answers.find({author: Meteor.userId()});
		if (answers.count() > 0) {
			let questions = [];
			let questionsIds = [];

			answers.fetch().forEach(function(item, index, array) {
				let latestAnswer = Answers.findOne({
					author: Meteor.userId(),
					questionId: item.questionId
				});

				let question = Questions.findOne(item.questionId);

				if (question !== void 0) {
					let flag = false;

					questionsIds.forEach(function(id) {
						if (item.questionId == id) {
							flag = true;
							return false;
						}
					});

					if (!flag) {
						questions.push(question);
					}
				}
				questionsIds.push(item.questionId);
			});
			return questions.length;
		}
	}
});

Template.SideNav.events({
	'click #logout-btn'(event) {
		Accounts.logout();
	},
	'click #edit-profile'() {
		alert('Hi');
	},
	'submit #unlock-role'(event) {
		event.preventDefault();

		let secretKey = event.target['secret-key'].value;

		Meteor.call('checkKey', secretKey, (err, res) => {
			if (err) throw new Error(err);

			if (res) {
				Meteor.call('change-role', (err, res) => {
					if (err) throw new Error(err);
					$('#input-role-secret-key').modal('close');
					$('#buy-role').modal('close');
				});
			} else {
				alert('Your key is broken!\nPlease try another key.');
			}
		})
	}
});

Template.registerHelper('checkRole', function(a, b) {
	if (a == b) {
		return true;
	} else {
		return false;
	}
});
