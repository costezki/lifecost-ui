import {Answers} from '/imports/collections/answersCollection';
import {Questions} from '/imports/collections/questionsCollection';

import './CheckboxType.html';

Template.CheckboxType.onCreated(function () {

});

Template.CheckboxType.helpers({
    answerOptions() {
        const question = Questions.findOne(Template.currentData().questionId);

        if (question !== void 0) {
            return {
                answers: question.answers.map((item) => {
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
                answer = answer.answer.split(',');

                return answer.map(function (item) {
                    return question.answers[item].label
                });
            }
        }
    }
});

Template.CheckboxType.events({});