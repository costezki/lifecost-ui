import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { Questions } from '/imports/collections/questionsCollections';
import { Answers } from '/imports/collections/answersCollections';
import { UserSettings } from '/imports/collections/userCollections';

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
		let userId = Accounts.createUser({
			email: email,
			password: password,
			username: userName,
			profile: {
				birthday: birthday
			},
			createdAt: new Date()
		});

		if (userId !== void 0) {
			UserSettings.insert({
				user: userId,
				userName: userName,
				email: email,
				birthday: birthday
			}, (err, res) => {
				if (err) throw new Error(err);
			})
		}
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

// TODO: doesn't work
export const setAnswerId = new ValidatedMethod({
	name: 'setAnswerId',
	validate: new SimpleSchema({
		questionId: { type: String },
		answerId: { type: String }
	}).validator(),
	run({ questionId, answerId }) {
		let question = Questions.findOne(questionId);

		if (question.answersId) {
			let array = question.answersId;
			array.push(answerId);

			let uniqueNames = [];
			$.each(array, function(i, el){
				if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
			});

			Questions.update(
				questionId,
				{$set: {
					answersId: [uniqueNames]
				}}
			);
		} else {
			Questions.update(
				questionId,
				{$set: {
					answersId: [answerId]
				}}
			);
		}


		return question;
	}
});
