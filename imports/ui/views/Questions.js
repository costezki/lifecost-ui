import { Questions } from '/imports/collections/questionsCollection';
import { Questionnaires } from '/imports/collections/questionnairesCollection';
import { Answers } from '/imports/collections/answersCollection';
import { updatePublicationQuestion, updatePublicationQuestionnaire} from './utils';

import './Questions.html';

Template.Questions.onCreated(function() {
	Meteor.subscribe('questions');
	Meteor.subscribe('questionnaire');
});

Template.Questions.onRendered(function() {
	$('.modal').modal();
	$('ul.tabs').tabs();
});

Template.Questions.helpers({
	Questions() {
		return Questions.find({author: Meteor.userId()});
	},
	Questionnaires() {
		return Questionnaires.find({author: Meteor.userId()});
	}
});

Template.Questions.events({
	'click .delete': function() {
		if (this.title) {
			let deleteQuestionnaire = confirm("Delete this questionnaire?\n\"" + this.title + "\"");

			if (deleteQuestionnaire) {
				Questionnaires.remove(this._id);
			}
		} else {
			let deleteQuestion = confirm("Delete this question?\n\"" + this.question + "\"");

			if (deleteQuestion) {
				let answers = Answers.find({questionId: this._id});

				if (answers.count() > 0) {
					Questions.update(this._id, {$set: {
						deprecated: true,
						published: false,
						publishedDate: null
					}});
				} else {
					Questions.remove(this._id);
				}
			}
		}
	},
	'click .make-publish': function() {
		let question = Questions.findOne(this._id);
		let questionnaire = Questionnaires.findOne(this._id);

		if (question !== void 0) {
			let published = question.published;

			updatePublicationQuestion(this._id, !published, published ? null:new Date(), false);
		} else if (questionnaire !== void 0) {
			let published = questionnaire.published;

			updatePublicationQuestionnaire(this._id, !published, published ? null:new Date());
		}
	}
});
