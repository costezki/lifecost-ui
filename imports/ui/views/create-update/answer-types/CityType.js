import {ReactiveVar} from 'meteor/reactive-var';

import {Answers} from '/imports/collections/answersCollection';
import {Questions} from '/imports/collections/questionsCollection';
import {ErrorHandler} from "/imports/ui/errors/ErrorHandler";

import './CityType.html';

Template.CityType.onCreated(function () {
    this.questionId = new ReactiveVar(Template.currentData().questionId);
    this.location = new ReactiveVar();
    this.inputValue = new ReactiveVar();
});

Template.CityType.helpers({
    lastAnswer() {
        const answers = Answers.find({author: Meteor.userId(), questionId: Template.instance().questionId.get()});

        if (answers.count() > 0) {
            let answer = answers.fetch()[answers.count() - 1];
            const question = Questions.findOne(answer.questionId);

            if (question !== void 0) {
                return JSON.parse(answer.answer).city;
            }
        }
    },
    location() {
        return Template.instance().location.get();
    }
});

Template.CityType.events({
    'input #location': function (event, template) {
        const inputValue = template.inputValue.get() || event.target.value;

        if (inputValue !== void 0 && inputValue.trim() !== '') {
            Meteor.call('getLocation', {inputValue, answerType: 4}, (err, location) => {
                if (err) new ErrorHandler(err.reason);

                template.parent().inputValue.set(inputValue);
                template.location.set(location);
            });
        } else {
            template.location.set(void 0);
        }
    },
    'click #locations li': function (event, template) {
        const location = this.city;

        $('#locations').find('li.collection-item').remove();
        $('#location').val(location);

        template.inputValue.set(location);
        template.parent().inputValue.set(location);
        template.location.set(void 0);
    }
});