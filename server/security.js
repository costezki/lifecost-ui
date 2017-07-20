import { Questions } from '/imports/collections/questionsCollections';
import { Answers } from '/imports/collections/answersCollections';
import { UserSettings } from '/imports/collections/userCollections';

Questions.allow({
	insert: function(userId, doc) {
		return !!userId;
	},
	update: function(userId, doc) {
		return !!userId;
	},
	remove: function(userId, doc) {
		return !!userId;
	}
});

Answers.allow({
	insert: function(userId, doc) {
		return !!userId;
	},
	update: function(userId, doc) {
		return !!userId;
	}
});

UserSettings.allow({
	insert: function(userId, doc) {
		return !!userId;
	},
	update: function(userId, doc) {
		return !!userId;
	}
});
