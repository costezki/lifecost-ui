import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

SimpleSchema.extendOptions(['autoform']);

export const SignUp = new SimpleSchema({
	userName: {
		type: String,
		label: 'User name',
		min: 6,
		max: 80
	},
	email: {
		type: String,
		label: 'Email',
		regEx: SimpleSchema.RegEx.Email,
		max: 100,
		autoform: {
			type: 'email'
		}
	},
	password: {
		type: String,
		label: 'Password',
		min: 8,
		max: 60,
		autoform: {
			type: 'password'
		}
	},
	confirmPassword: {
		type: String,
		label: 'Confirm password',
		min: 8,
		max: 60,
		autoform: {
			type: 'password'
		},
		custom: function() {
			if (this.value !== this.field('password').value) {
				return "passwordNotEqual";
			}
		}
	}
}, { tracker: Tracker });

export const SignIn = new SimpleSchema({
	email: {
		type: String,
		label: 'Email',
		regEx: SimpleSchema.RegEx.Email,
        autoform: {
            type: 'email'
        }
	},
	password: {
		type: String,
		label: 'Password',
		autoform: {
			type: 'password'
		}
	}
}, { tracker: Tracker });
