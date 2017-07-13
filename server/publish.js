import { Questions } from '/imports/collections/questionsCollections';
import { Answers } from '/imports/collections/answersCollections';

Meteor.publish('questions', function () {
    return Questions.find({});
});

Meteor.publish('answers', function () {
    return Answers.find({author: this.userId});
});
