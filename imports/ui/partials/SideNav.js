import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';

import './SideNav.html';

Template.SideNav.onCreated(function() {
	Meteor.subscribe('questions');
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
	birthday() {
		let date = Meteor.users.findOne({_id: Meteor.userId()}).profile.birthday;
		return moment(date).format('MMMM Do YYYY');
	},
	questionsLength() {
		return Questions.find({author: Meteor.userId()}).fetch().length;
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
