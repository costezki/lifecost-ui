import {ReactiveVar} from 'meteor/reactive-var';

import {Answers} from '/imports/collections/answersCollection';
import {Questions} from '/imports/collections/questionsCollection';

import './RadioButtonType.html';

Template.RadioButtonType.onCreated(function () {
    this.otherAnswerType = new ReactiveVar();
});

Template.RadioButtonType.helpers({
    answerOptions() {
        const question = Questions.findOne(Template.currentData().questionId);

        if (question !== void 0) {
            return {
                answers: question.answers.map((item, index) => {
                    return item;
                })
            };
        }
    },
    lastAnswer() {
        const answers = Answers.find({author: Meteor.userId(), questionId: Template.currentData().questionId});

        if (answers.count() > 0) {
            let answer = answers.fetch()[answers.count() - 1];
            const question = Questions.findOne(answer.questionId);

            if (question !== void 0) {
                Template.instance().otherAnswerType.set(question.otherAnswerType);

                return question.answers[answer.answer];
            }
        }
    },
    otherAnswerType() {
        return Template.instance().otherAnswerType.get();
    }
});

Template.RadioButtonType.events({});