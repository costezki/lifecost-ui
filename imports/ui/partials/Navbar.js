import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './Navbar.html';

Template.Navbar.onCreated(function() {

});

Template.Navbar.onRendered(function() {
	$('.modal').modal();

	setTimeout(function() {
		$('.dropdown-button').dropdown({
			inDuration: 300,
			outDuration: 225,
			constrainWidth: true, // Does not change width of dropdown to that of the activator
			hover: false, // Activate on hover
			gutter: 0, // Spacing from edge
			belowOrigin: true, // Displays dropdown below the button
			alignment: 'left', // Displays dropdown with edge aligned to the left of button
			stopPropagation: false // Stops event propagation
		});
	}, 500);
});

Template.Navbar.helpers({

});

Template.Navbar.events({
	'click #logout-btn'(event) {
		Accounts.logout();
	},
});
