import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { Questions } from '/imports/collections/questionsCollections';

SimpleSchema.extendOptions(['autoform']);

export const Answers = new Mongo.Collection('answers');

let answersSchema = new SimpleSchema({
	questionId: {
		type: String,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false
		},
	},
	author: {
		type: 'String',
		autoform: {
			type: 'hidden',
			label: false
		},
		autoValue: function() {
			return Meteor.userId();
		}
	},
	answer: {
		type: String,
		autoform: {
			type: function() {
				let question = Questions.findOne({_id: FlowRouter.getParam('id')});
				if (question !== void 0) {
					if (question.answersType == 0) {
						return 'select-checkbox-inline';
					} else if (question.answersType == 1) {
						return 'select-radio-inline';
					}
				}
			},
			label: function() {
				let question = Questions.findOne({_id: FlowRouter.getParam('id')});
				if (question !== void 0) {
					if (question.answersType >= 2) {
						return ' ';
					}
				}
			},
			options: function (){
				let question = Questions.findOne({_id: FlowRouter.getParam('id')});
				if (question !== void 0) {
					if (question.answersType < 2) {
						let answers = [];

						question.answers.forEach(function(item, index) {
							answers.push({
								label: item,
								value: index
							});
						});

						return answers;
					} else {
						return null;
					}
				}
			}
		}
	},
	createdAt: {
		type: Date,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false
		},
		autoValue: function() {
			return new Date();
		}
	}
}, { tracker: Tracker });

Answers.attachSchema(answersSchema);
