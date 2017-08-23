import {ValidatedMethod} from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import {Answers} from '/imports/collections/answersCollection';
import {UserSettings} from '/imports/collections/userCollection';

export const createAccounts = new ValidatedMethod({
    name: 'createAccounts',
    validate: new SimpleSchema({
        email: {type: String},
        password: {type: String},
        confirmPassword: {type: String},
        userName: {type: String},
        birthday: {type: Date}
    }).validator(),
    run({email, password, confirmPassword, userName, birthday}) {
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
        userName: {type: String}
    }).validator(),
    run({userName}) {
        Accounts.setUsername(Meteor.userId(), userName);
    }
});

export const addAnswer = new ValidatedMethod({
    name: 'addAnswer',
    validate: new SimpleSchema({
        answer: {type: String},
        questionId: {type: String}
    }).validator(),
    run({answer, questionId}) {
        return Answers.insert({
            answer: answer,
            questionId: questionId,
            author: Meteor.userId(),
            createdAt: new Date()
        });
    }
});
