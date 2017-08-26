import {UserSettings} from '/imports/collections/userCollection';
import {Questions} from '/imports/collections/questionsCollection';

Template.registerHelper('getDate', function (date) {
    return moment(date).format("DD/MM/YYYY");
});

Template.registerHelper('getBirthday', function (date) {
    return moment(date).format("MMM Do YYYY");
});

Template.registerHelper('getAuthor', function (author) {
    let user = UserSettings.findOne({user: author});
    if (user !== void 0) return user.userName;
});

Template.registerHelper('checkUser', function (user) {
    return user !== Meteor.userId();
});

Template.registerHelper('not', function (a) {
    return !a;
});

Template.registerHelper('upIndex', function (index) {
    return index + 1;
});

Template.registerHelper('firstQuestion', function (index) {
    return (index + 1) === 1;
});

Template.registerHelper('getQuestions', function (questionsList) {
    if (questionsList !== void 0) {
        let questions = [];

        questionsList.forEach(function (questionId) {
            let question = Questions.findOne({_id: questionId, published: true});
            if (question !== void 0) {
                questions.push(question);
            }
        });

        return questions;
    }
});

Template.registerHelper('checkRole', function (a, b) {
    return a === b;
});

Template.registerHelper('checkAnswerType', function (type) {
    return type === 'checkbox';
});

Template.registerHelper('changeModuleName', function (module) {
    return module.replace('.json', '');
});