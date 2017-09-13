import {ReactiveVar} from 'meteor/reactive-var';

import {Questions} from '/imports/collections/questionsCollection';

import './CreateQuestion.html';

Template.CreateQuestion.onCreated(function () {
    this.published = new ReactiveVar(false);

    AutoForm.addHooks('createQuestion', {
        onSuccess: function () {
            FlowRouter.go('/questions');
        },
        formToDoc: function (doc) {
            $('.other-input').parent().css('display', doc.answersType !== 0 ? 'none' : 'inherit');

            if (doc.answersType >= 2 || doc.answersType === void 0) {
                $('#createQuestion').find('.collection').css('display', 'none');
            } else {
                $('#createQuestion').find('.collection').css('display', 'inherit');
            }
            return doc;
        }
    }, true);
});

Template.CreateQuestion.onRendered(function () {
    $('input#question-title, textarea#question-desc').characterCounter();

    $('.tooltipped').tooltip({
        delay: 50,
        tooltip: 'Add to publish page',
        position: 'top'
    });
});

Template.CreateQuestion.helpers({
    Questions() {
        return Questions;
    },
    published() {
        return Template.instance().published.get();
    },
    Date() {
        return new Date();
    }
});

Template.CreateQuestion.events({
    'click .make-publish': function (event, template) {
        template.published.set(!template.published.get());
    }
});
