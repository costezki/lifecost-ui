import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

export const createAccounts = new ValidatedMethod({
	name: 'createAccounts',
	validate: new SimpleSchema({
		email: { type: String },
		password: { type: String },
		confirmPassword: { type: String },
		userName: { type: String },
		birthday: { type: Date }
	}).validator(),
	run({ email, password, confirmPassword, userName, birthday }) {
		Accounts.createUser({
			email: email,
			password: password,
			username: userName,
			profile: {
				birthday: birthday
			},
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
