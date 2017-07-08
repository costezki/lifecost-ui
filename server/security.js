import { Questions } from '/imports/collections/questionsCollections';

Questions.allow({
	insert: function(userId, doc) {
		return !!userId;
	},
	update: function(userId, doc) {
		return !!userId;
	}
});
