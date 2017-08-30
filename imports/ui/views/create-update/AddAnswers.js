import './AddAnswers.html';

Template.AddAnswers.onCreated(function () {
    Meteor.subscribe('answers');
    Meteor.subscribe('questions');
});


