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
	question: {
		type: 'String',
		optional: true,
		autoform: {
			type: 'hidden'
		}
	},
	authorWhoCreated: {
		type: 'String',
		optional: true,
		autoform: {
			type: 'hidden'
		}
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
	description: {
		type: 'String',
		optional: true,
		autoform: {
			type: 'hidden'
		}
	},
	answersType: {
		type: Number,
		autoform: {
			type: function() {
				let question = Questions.findOne({_id: FlowRouter.getParam('id')});
				if (question !== void 0) {
					if (question.answersType == 0) {
						return 'select-checkbox-inline';
					} else {
						return 'select-radio-inline';
					}
				}
			},
			options: function (){
				let question = Questions.findOne({_id: FlowRouter.getParam('id')});
				if (question !== void 0) {
					let answers = [];

					question.answers.forEach(function(item, index) {
						answers.push({
							label: item,
							value: index
						});
					});

					return answers;
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
