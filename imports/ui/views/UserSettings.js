import { UserSettings } from '/imports/collections/userCollection';

import './UserSettings.html';

Template.UserSettings.onCreated(function() {
	Meteor.subscribe('userSettings');
});

Template.UserSettings.helpers({
	UserSettings() {
		return UserSettings;
	},
	settings() {
		return UserSettings.findOne({user: Meteor.userId()});
	}
});
