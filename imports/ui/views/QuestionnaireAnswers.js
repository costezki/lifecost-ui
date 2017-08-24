import {Questions} from '/imports/collections/questionsCollection';
import {Answers} from '/imports/collections/answersCollection';
import {questionnaireInsertAnswer} from '/imports/ui/views/utils';

import './QuestionnaireAnswers.html';

Template.QuestionnaireAnswers.onCreated(function () {

});

Template.QuestionnaireAnswers.helpers({
    question() {
        let questionId = Template.currentData().activeQuestion;
        let question = Questions.findOne(questionId);

        if (question !== void 0) {
            return question;
        }
    },
    answer() {
        let questionId = Template.currentData().activeQuestion;
        let answers = Answers.find({author: Meteor.userId(), questionId: questionId});

        if (answers.count() > 0) {
            let answer = answers.fetch()[answers.count() - 1];
            let question = Questions.findOne(answer.questionId);

            if (question !== void 0) {
                let answerType = question.answersType;

                if (answerType === 0) {
                    let selectedAnsers = [];
                    answer = answer.answer.split(',');

                    answer.forEach(function (item) {
                        selectedAnsers.push(question.answers[item])
                    });

                    return selectedAnsers;
                } else if (answerType === 1) {
                    return question.answers[answer.answer];
                } else {
                    return answer.answer;
                }
            }
        }
    },
    answerOptions() {
        let questionId = Template.currentData().activeQuestion;
        let question = Questions.findOne(questionId);

        if (question !== void 0) {
            let answers = [];
            let answersType = question.answersType;

            if (answersType !== 2) {
                question.answers.forEach(function (item, index) {
                    answers.push({
                        label: item,
                        value: index
                    });
                });

                let answerType = answersType === 1 ? 'radioButton' : 'checkbox';

                return {answers, answerType: answerType};
            }
        }
    }
});

Template.QuestionnaireAnswers.events({
    'submit #insert-answer': function (event, template) {
        event.preventDefault();

        let questionId = Template.currentData().activeQuestion;
        let question = Questions.findOne(questionId);

        if (question.answersType === 0) {
            let answers = [];
            let checkboxes = event.target.answer;

            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    answers.push(i);
                }
            }

            questionnaireInsertAnswer(answers.toString(), questionId, template);
        } else if (question.answersType === 1) {
            event.target.answer.forEach(function (item, answer) {
                if (item.checked) {
                    questionnaireInsertAnswer(answer.toString(), questionId, template);
                }
            });
        } else {
            let answer = event.target.answer.value;

            questionnaireInsertAnswer(answer, questionId, template);
        }
    }
});
