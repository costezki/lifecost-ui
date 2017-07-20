import { UserSettings } from '/imports/collections/userCollections';

import './main.html';

import '/imports/ui/controller';
import './config/autoform';

Template.registerHelper('getDate', function(date) {
	return moment(date).format("MMM Do YYYY, h:mm:ss a");
});

Template.registerHelper('getBirthday', function(date) {
	return moment(date).format("MMM Do YYYY");
});

Template.registerHelper('getAuthor', function(author) {
	let user = UserSettings.findOne({user: author});
	if (user !== void 0) return user.userName;
});

Template.registerHelper('checkUser', function(user) {
	if (user !== Meteor.userId()) {
		return true;
	} else {
		return false;
	}
});
