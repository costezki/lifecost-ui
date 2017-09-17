import {Questions} from '/imports/collections/questionsCollection';
import {Answers} from '/imports/collections/answersCollection';
import {Questionnaires} from '/imports/collections/questionnairesCollection';
import {UserSettings} from '/imports/collections/userCollection';

Meteor.publish('userSettings', function () {
    return UserSettings.find();
});

Meteor.publish('questionnaires', function () {
    return Questionnaires.find();
});

Meteor.publish('answers', function () {
    return Answers.find();
});

Meteor.publish('questions', function () {
    return Questions.find();
});

Meteor.publish("userStatus", function () {
    return Meteor.users.find();
});