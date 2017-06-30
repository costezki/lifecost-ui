import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

export const createAccounts = new ValidatedMethod({
	name: 'createAccounts',
	validate: new SimpleSchema({
		email: { type: String },
		password: { type: String },
		confirmPassword: { type: String },
		userName: { type: String }
	}).validator(),
	run({ email, password, confirmPassword, userName }) {
		Accounts.createUser({
			email: email,
			password: password,
			username: userName,
			createdAt: new Date()
		});
	}
});

export const setUsername = new ValidatedMethod({
	name: 'setUsername',
	validate: new SimpleSchema({
		userName: { type: String }
	}).validator(),
	run({ userName }) {
		Accounts.setUsername(Meteor.userId(), userName);
	}
});
