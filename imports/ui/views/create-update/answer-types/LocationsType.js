import {ReactiveVar} from 'meteor/reactive-var';

import {Answers} from '/imports/collections/answersCollection';
import {Questions} from '/imports/collections/questionsCollection';
import {ErrorHandler} from "/imports/ui/errors/ErrorHandler";

import './LocationsType.html';

Template.LocationsType.onCreated(function () {
    this.questionId = new ReactiveVar(Template.currentData().questionId);
    this.location = new ReactiveVar();
    this.answerType = new ReactiveVar();
    this.inputValue = new ReactiveVar();
});

Template.LocationsType.helpers({
    lastAnswer() {
        const answers = Answers.find({author: Meteor.userId(), questionId: Template.instance().questionId.get()});

        if (answers.count() > 0) {
            let answer = answers.fetch()[answers.count() - 1];
            const question = Questions.findOne(answer.questionId);

            if (question !== void 0) {
                Template.instance().answerType.set(question.answersType);

                return question.answersType === 3 ?
                    JSON.parse(answer.answer).country : JSON.parse(answer.answer).city;
            }
        }
    },
    locationType() {
        const question = Questions.findOne(Template.instance().questionId.get());

        if (question !== void 0) {
            Template.instance().answerType.set(question.answersType);

            return question.answersType === 3;
        }
    },
    location() {
        return Template.instance().location.get();
    }
});

Template.LocationsType.events({
    'input #location': function (event, template) {
        const inputValue = template.inputValue.get() || event.target.value;
        const answerType = template.answerType.get();

        if (inputValue !== void 0 && inputValue.trim() !== '') {
            Meteor.call('getLocation', {inputValue, answerType}, (err, location) => {
                if (err) new ErrorHandler(err.reason);

                template.parent().inputValue.set(inputValue);
                template.location.set(location);
            });
        } else {
            template.location.set(void 0);
        }
    },
    'click #locations li': function (event, template) {
        const location = template.answerType.get() === 3 ? this.country : this.city;

        $('#locations').find('li.collection-item').remove();
        $('#location').val(location);

        template.inputValue.set(location);
        template.parent().inputValue.set(location);
        template.location.set(void 0);
    }
});