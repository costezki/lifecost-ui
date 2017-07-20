import { Questions } from '/imports/collections/questionsCollections';
import { Answers } from '/imports/collections/answersCollections';
import { UserSettings } from '/imports/collections/userCollections';

Meteor.publish('questions', function () {
    return Questions.find({});
});

Meteor.publish('answers', function () {
    return Answers.find({author: this.userId});
});

Meteor.publish('userSettings', function () {
    return UserSettings.find();
});
