import {ReactiveVar} from 'meteor/reactive-var';

import {Questionnaires} from '/imports/collections/questionnairesCollection';
import {qqList} from './utils';
import {ErrorHandler} from "../errors/ErrorHandler";

import './ShowQuestionnaire.html';

Template.ShowQuestionnaire.onCreated(function () {
    Meteor.subscribe('questions');
    Meteor.subscribe('questionnaires');

    let firstQuestions = {
        questionNumber: 0,
        cleared: false
    };

    this.clearedQuestions = new ReactiveVar([firstQuestions]);
    this.activeQuestion = new ReactiveVar(firstQuestions);
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

            return questions[activeQuestion.questionNumber];
        }
    }
});


// TODO: It is necessary to make pagination for convenient movement on the questionnaire
Template.ShowQuestionnaire.events({
    'click .pagination a': function (event, template) {
        let questionId = event.target.id;
        let activeQuestion = qqList(FlowRouter.getParam('id'));

        if (activeQuestion !== void 0) {
            let question = activeQuestion.indexOf(questionId);
            let clearedQuestion = template.clearedQuestions.get()[question];

            if (clearedQuestion !== void 0 && clearedQuestion.cleared) {
                $('.pagination').find('li').removeClass('active');
                $(event.target.parentNode).addClass('active');

                let nextQuestions = template.clearedQuestions.get()[question];

                template.activeQuestion.set(nextQuestions);
            } else {
                new ErrorHandler("Complete the previous question to answer the following questions...")
            }
        }
    }
});
