import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

SimpleSchema.extendOptions(['autoform']);

export const Questions = new Mongo.Collection('questions');

let questionsSchema = new SimpleSchema({
	question: {
		type: 'String',
		label: 'Question text'
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
		label: 'Question description',
		autoform: {
			type: 'textarea',
			class: 'materialize-textarea',
			length: 1000
		}
	},
	answersType: {
		type: Number,
		label: 'Answers type',
		autoform: {
			type: 'select',
			options: function() {
				return [
					{ label: 'Checkbox', value: 0 },
					{ label: 'Radio button', value: 1 },
					{ label: 'Input', value: 2 },
				]
			}
		}
	},
	answers: {
		type: Array,
		label: 'Answer',
		optional: true
	},
	'answers.$': {
		type: String,
		optional: true
	},
	answersId: {
		type: Array,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false
		}
	},
	'answersId.$': {
		type: String
	},
	publishedDate: {
		type: Date,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false
		}
	},
	published: {
		type: Boolean,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false
		},
		defaultValue: false
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

Questions.attachSchema(questionsSchema);
