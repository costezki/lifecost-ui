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
		defaultValue: function() {
			return Meteor.userId();
		},
		autoform: {
			type: 'hidden',
			label: false
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
					{label: 'Checkbox', value: 0},
					{label: 'Radio button', value: 1}
				]
			}
		}
	},
	answers: {
		type: Array,
		label: 'Answer'
	},
	'answers.$': {
		type: String
	}
}, { tracker: Tracker });

Questions.attachSchema(questionsSchema);
