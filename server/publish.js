import { Questions } from '/imports/collections/questionsCollections';

Meteor.publish('questions', function () {
    return Questions.find({});
});
