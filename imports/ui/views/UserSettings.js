import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { UserSettings } from '/imports/collections/userCollections';

import './UserSettings.html';

Template.UserSettings.onCreated(function() {
	Meteor.subscribe('userSettings');
});

Template.UserSettings.onRendered(function() {

});

Template.UserSettings.helpers({
	UserSettings() {
		return UserSettings;
	},
	settings() {
		return UserSettings.findOne({user: Meteor.userId()});
	}
});

Template.UserSettings.events({

});
