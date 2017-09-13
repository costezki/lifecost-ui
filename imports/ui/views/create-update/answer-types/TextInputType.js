import {Answers} from '/imports/collections/answersCollection';
import {Questions} from '/imports/collections/questionsCollection';

import './TextInputType.html';

Template.TextInputType.onCreated(function () {

});

Template.TextInputType.helpers({
    lastAnswer() {
        const answers = Answers.find({author: Meteor.userId(), questionId: Template.currentData().questionId});

        if (answers.count() > 0) {
            let answer = answers.fetch()[answers.count() - 1];
            const question = Questions.findOne(answer.questionId);

            if (question !== void 0) {
                return answer.answer;
            }
        }
    }
});

Template.TextInputType.events({});