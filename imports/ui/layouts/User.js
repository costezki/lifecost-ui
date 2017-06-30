import { Meteor } from 'meteor/meteor';
import { Tmeplate } from 'meteor/templating';

import './User.html';

Template.User.onCreated(function() {
});

Template.User.onRendered(function() {
	$('ul.tabs').tabs();
});

Template.User.helpers({

});

Template.User.events({
	'click #logout-btn'(event) {
		Accounts.logout();
	}
});
