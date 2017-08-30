import {Answers} from '/imports/collections/answersCollection';
import {Questions} from '/imports/collections/questionsCollection';
import {insertAnswer} from '../utils';

import './Answer.html';

Template.Answer.onCreated(function () {
    Meteor.subscribe('answers');
    Meteor.subscribe('questions');
});

Template.Answer.helpers({
    question() {
        let question = Questions.findOne(FlowRouter.getParam('id'));

        if (question !== void 0) {
            if (question.published) {
                return question;
            } else {
                if (question.deprecated) {
                    return question;
                } else {
                    FlowRouter.go('/published-questions');
                }
            }
        }
    },
    answer() {
        let answers = Answers.find({author: Meteor.userId(), questionId: FlowRouter.getParam('id')});

        if (answers.count() > 0) {
            let answer = answers.fetch()[answers.count() - 1];
            let question = Questions.findOne(answer.questionId);

            if (question !== void 0) {
                let answerType = question.answersType;
                if (answerType === 0) {
                    let selectedAnswers = [];
                    answer = answer.answer.split(',');

                    answer.forEach(function (item) {
                        selectedAnswers.push(question.answers[item])
                    });

                    return selectedAnswers;
                } else if (answerType === 1) {
                    return question.answers[answer.answer];
                } else {
                    return answer.answer;
                }
            }
        }
    },
    answerOptions() {
        let question = Questions.findOne(FlowRouter.getParam('id'));

        if (question !== void 0) {
            let answers = [];

            if (question.answersType !== 2) {
                question.answers.forEach(function (item, index) {
                    answers.push({
                        label: item,
                        value: index
                    });
                });
                if (question.answersType === 1) {
                    return {answers, answerType: 'radioButton'};
                } else {
                    return {answers, answerType: 'checkbox'};
                }
            }
        }
    }
});

Template.Answer.events({
    'submit #insert-answer': function (event) {
        event.preventDefault();

        let questionId = FlowRouter.getParam('id');
        let question = Questions.findOne(questionId);

        if (question.answersType === 0) {
            let answers = [];
            let checkboxes = event.target.answer;

            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    answers.push(i);
                }
            }
            insertAnswer(answers.toString(), questionId);
        } else if (question.answersType === 1) {
            event.target.answer.forEach(function (item, answer) {
                if (item.checked) {
                    insertAnswer(answer.toString(), questionId);
                }
            });
        } else {
            let answer = event.target.answer.value;

            insertAnswer(answer, questionId);
        }
    }
});