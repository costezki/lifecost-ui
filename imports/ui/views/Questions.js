import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Questions } from '/imports/collections/questionsCollections';
import { Answers } from '/imports/collections/answersCollections';

import './Questions.html';

Template.Questions.onCreated(function() {
	Meteor.subscribe('questions');
});

Template.Questions.onRendered(function() {
	$('.tooltipped').tooltip();
});
Template.Questions.helpers({
	Questions() {
		return Questions.find({author: Meteor.userId()});
	}
});

Template.Questions.events({
	'click .delete-question': function() {
		var deleteQuestion = confirm("Delete this question?\n\"" + this.question + "\"");

		if (deleteQuestion) {
			let answers = Answers.find({questionId: this._id});
			if (answers.fetch().length > 0) {
				Questions.update(this._id, {$set: {
					deprecated: true,
					published: false,
					publishedDate: null
				}});
			} else {
				Questions.remove(this._id);
			}
		}
	},
	'click .make-publish': function(event) {
		let published = Questions.findOne(this._id);

		if (published.published) {
			Questions.update(this._id, {$set: {
				published: false,
				publishedDate: null
			}}, (err, res) => {
				if (err) throw new Error(err);
			});
		} else {
			if (published.deprecated) {
				Questions.update(this._id, {$set: {
					published: true,
					publishedDate: new Date(),
					deprecated: false
				}});
			} else {
				Questions.update(this._id, {$set: {
					published: true,
					publishedDate: new Date()
				}});
			}
		}
	}
});
