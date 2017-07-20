import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

SimpleSchema.extendOptions(['autoform']);

export const UserSettings = new Mongo.Collection('userSettings');

let userSettingsSchema = new SimpleSchema({
	user: {
		type: String,
		autoform: {
			type: 'hidden',
			label: false
		}
	},
	userName: {
		type: String,
		min: 3,
		max: 60,
		label: 'User name:'
	},
	email: {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		label: 'E-mail:',
		autoform: {
			type: 'email'
		}
	},
	birthday: {
		type: Date,
		label: 'Birthday:',
		autoform: {
			type: 'pickadate',
			class: 'with-gap',
			pickadateOptions: {
				closeOnSelect: true,
				closeOnClear: true,
				selectYears: 100,
				selectMonths: true,
				max: new Date()
			}
		},
		autoValue: function() {
			return new Date(this.value);
		}
	}
});

UserSettings.attachSchema(userSettingsSchema);
