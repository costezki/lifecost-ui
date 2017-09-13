import {Questions} from '/imports/collections/questionsCollection';
import {Answers} from '/imports/collections/answersCollection';

import './ShowAnswers.html';

Template.ShowAnswers.onCreated(function () {
    Meteor.subscribe('answers');
});

Template.ShowAnswers.helpers({
    answers() {
        const answers = Answers.find({author: Meteor.userId()});

        if (answers.count() > 0) {
            let questions = [];
            let questionsIds = [];

            answers.fetch().forEach(function (item) {
                const question = Questions.findOne(item.questionId);

                if (question !== void 0) {
                    let flag = false;

                    questionsIds.forEach(function (id) {
                        if (item.questionId === id) {
                            flag = true;
                            return false;
                        }
                    });

                    if (!flag) {
                        switch (question.answersType) {
                            case 0:
                                questions.push({
                                    question: question,
                                    answer: item.answer.split(',').map((answer) => {
                                        return question.answers[answer];
                                    }),
                                    answerCreatedAt: item.createdAt
                                });
                                break;
                            case 1:
                                questions.push({
                                    question: question,
                                    answer: question.answers[item.answer],
                                    answerCreatedAt: item.createdAt
                                });
                                break;
                            case 2:
                                questions.push({
                                    question: question,
                                    answer: item.answer,
                                    answerCreatedAt: item.createdAt
                                });
                                break;
                            case 3:
                                questions.push({
                                    question: question,
                                    answer: JSON.parse(item.answer).country,
                                    answerCreatedAt: item.createdAt
                                });
                                break;
                            case 4:
                                questions.push({
                                    question: question,
                                    answer: JSON.parse(item.answer).city,
                                    answerCreatedAt: item.createdAt
                                });
                                break;
                        }
                    }
                }
                questionsIds.push(item.questionId);
            });
            return questions;
        }
    }
});
