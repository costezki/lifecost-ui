import {ReactiveVar} from 'meteor/reactive-var';

import {Questionnaires} from '/imports/collections/questionnairesCollection';
import {qqList} from './utils';

import './ShowQuestionnaire.html';

Template.ShowQuestionnaire.onCreated(function () {
    Meteor.subscribe('questions');
    Meteor.subscribe('questionnaires');

    this.activeQuestion = new ReactiveVar(0);
});

Template.ShowQuestionnaire.helpers({
    questionnaire() {
        let questionnaire = Questionnaires.findOne(FlowRouter.getParam('id'));
        if (questionnaire !== void 0) return questionnaire.questionsList;
    },
    question() {
        let questions = qqList(FlowRouter.getParam('id'));
        if (questions !== void 0) {
            let activeQuestion = Template.instance().activeQuestion.get();

            return questions[activeQuestion];
        }
    }
});

Template.ShowQuestionnaire.events({
    'click .pagination a': function (event, template) {
        let questionId = event.target.id;
        let activeQuestion = qqList(FlowRouter.getParam('id'));

        if (activeQuestion !== void 0) {
            let question = activeQuestion.indexOf(questionId);

            $('.pagination').find('li').removeClass('active');
            $(event.target.parentNode).addClass('active');

            template.activeQuestion.set(question);
        }
    }
});
