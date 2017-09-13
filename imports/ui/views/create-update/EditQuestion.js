import {Questions} from '/imports/collections/questionsCollection';

import './EditQuestion.html';

Template.EditQuestion.onCreated(function () {
    AutoForm.addHooks('updateQuestion', {
        onSuccess: function () {
            FlowRouter.go('/questions');
        },
        formToDoc: function (doc) {
            $('.other-input').parent().css('display', doc.answersType !== 0 ? 'none' : 'inherit');

            if (doc.answersType >= 2 || doc.answersType === void 0) {
                $('#updateQuestion').find('.collection').css('display', 'none');
            } else {
                $('#updateQuestion').find('.collection').css('display', 'inherit');
            }
            return doc;
        }
    }, true);
});

Template.EditQuestion.onRendered(function () {
    $('input#question-title, textarea#question-desc').characterCounter();
});

Template.EditQuestion.helpers({
    Question() {
        const question = Questions.findOne({_id: FlowRouter.getParam('id')});

        if (question !== void 0) {
            return question;
        }
    },
    Questions() {
        return Questions;
    }
});
