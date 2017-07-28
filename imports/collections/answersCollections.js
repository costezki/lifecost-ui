import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { Questions } from '/imports/collections/questionsCollections';

SimpleSchema.extendOptions(['autoform']);

export const Answers = new Mongo.Collection('answers');

export const AnswersSchema = {};

AnswersSchema.checkboxType = new SimpleSchema({
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
			label: false,
			value: function() {
				return Meteor.userId();
			}
		}
	},
	answer: {
		type: Array,
		autoform: {
			type: 'select-checkbox-inline',
			options: function () {
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
		},
	},
	'answer.$': {
		type: String
	},
	createdAt: {
		type: Date,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false,
			value: function() {
				return new Date();
			}
		}
	}
}, { tracker: Tracker });

AnswersSchema.radioButtonType = new SimpleSchema({
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
			label: false,
			value: function() {
				return Meteor.userId();
			}
		}
	},
	answer: {
		type: String,
		autoform: {
			type: 'select-radio-inline',
			options: function () {
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
		},
	},
	createdAt: {
		type: Date,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false,
			value: function() {
				return new Date();
			}
		}
	}
}, { tracker: Tracker });

AnswersSchema.textType = new SimpleSchema({
	questionId: {
		type: String,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false
		}
	},
	author: {
		type: 'String',
		autoform: {
			type: 'hidden',
			label: false,
			value: function() {
				return Meteor.userId();
			}
		}
	},
	answer: {
		type: String,
		autoform: {
			type: 'text',
			label: false
		}
	},
	createdAt: {
		type: Date,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false,
			value: function() {
				return new Date();
			}
		}
	}
}, { tracker: Tracker });
