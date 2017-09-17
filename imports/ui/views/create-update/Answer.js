import {ReactiveVar} from 'meteor/reactive-var';

import {Questions} from '/imports/collections/questionsCollection';
import {insertAnswer, checkLocation} from '../utils';

import './Answer.html';
import {ErrorHandler} from "../../errors/ErrorHandler";

Template.Answer.onCreated(function () {
    Meteor.subscribe('answers');
    Meteor.subscribe('questions');

    this.questionId = new ReactiveVar();
    this.answerType = new ReactiveVar();
    this.location = new ReactiveVar();
    this.inputValue = new ReactiveVar();
});

Template.Answer.helpers({
    question() {
        // qqId = questionnaire question id
        const qqId = Template.currentData().questionId;
        let question;

        if (qqId !== void 0) {
            Template.instance().questionId.set(qqId);
            question = Questions.findOne(qqId);
        } else {
            Template.instance().questionId.set(FlowRouter.getParam('id'));
            question = Questions.findOne(FlowRouter.getParam('id'));
        }

        if (question !== void 0) {
            if (question.published || question.deprecated) {
                Template.instance().answerType.set(question.answersType);
                return question;
            } else {
                FlowRouter.go('/published-questions');
            }
        }
    },
    currentQuestionId() {
        return Template.instance().questionId.get();
    },
    answerType() {
        return Template.instance().answerType.get();
    }
});

Template.Answer.events({
    'submit #insert-answer': function (event, template) {
        event.preventDefault();

        const questionId = Template.instance().questionId.get();
        const answerType = template.answerType.get();
        const inputValue = template.inputValue.get();
        const answer = event.target.answer;
        const isQuestionnaire = Template.currentData().isQuestionnaire;

        switch (answerType) {
            case 0:
                let answers = [];

                answer.forEach((item, index) => {
                    if (item.checked) answers.push(index);
                });

                insertAnswer(answers.toString(), questionId, template, isQuestionnaire);
                break;
            case 1:
                answer.forEach(function (item, answer) {
                    if (item.checked) {
                        if (item.id === 'other-type') {
                            const otherValue = $('#other-input').val().trim();

                            if (otherValue !== '' && otherValue !== void 0) {
                                insertAnswer(JSON.stringify({
                                    label: 'Other',
                                    value: otherValue,
                                    answerNumber: answer
                                }), questionId, template, isQuestionnaire);
                            } else {
                                new ErrorHandler('Input value', null, null, 'warning');
                            }
                        } else {
                            insertAnswer(answer.toString(), questionId, template, isQuestionnaire);
                        }
                    }
                });
                break;
            case 2:
                insertAnswer(answer.value, questionId, template, isQuestionnaire);
                break;
            default:
                Meteor.call('getLocation', {inputValue, answerType}, (err, location) => {
                    if (err) new ErrorHandler(err.reason);

                    if (location.length === 1) {
                        checkLocation(location, inputValue, answerType === 3 ? 'country' : 'city', questionId, template, isQuestionnaire);
                    } else if (location.length > 1) {
                        new ErrorHandler('Select one variant from list!', null, null, 'warning')
                    } else {
                        new ErrorHandler('No result!', null, null, 'warning')
                    }
                });
                break;
        }
    }
});
