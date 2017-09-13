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

    this.questionnaireId = new ReactiveVar(FlowRouter.getParam('id'));
    this.questionsList = new ReactiveVar();
    this.clearedQuestions = new ReactiveVar([firstQuestions]);
    this.activeQuestion = new ReactiveVar(firstQuestions);
});

Template.ShowQuestionnaire.helpers({
    questionnaire() {
        const questionnaire = Questionnaires.findOne(Template.instance().questionnaireId.get());

        if (questionnaire !== void 0) return questionnaire.questionsList;
    },
    question() {
        const questions = qqList(Template.instance().questionnaireId.get());
        Template.instance().questionsList.set(questions);

        if (questions !== void 0) {
            let activeQuestion = Template.instance().activeQuestion.get();

            return questions[activeQuestion.questionNumber];
        }
    },
    isQuestionnaire() {
        return true;
    }
});


// TODO: It is necessary to make pagination for convenient movement on the questionnaire
Template.ShowQuestionnaire.events({
    'click .pagination a': function (event, template) {
        const questionId = event.target.id;
        const activeQuestion = Template.instance().questionsList.get();

        if (activeQuestion !== void 0) {
            const question = activeQuestion.indexOf(questionId);
            const clearedQuestion = template.clearedQuestions.get()[question];

            if (clearedQuestion !== void 0 && clearedQuestion.cleared) {
                $('.pagination').find('li').removeClass('active');
                $(event.target.parentNode).addClass('active');

                template.activeQuestion.set(template.clearedQuestions.get()[question]);
            } else {
                new ErrorHandler("Complete the previous question to answer the following questions...")
            }
        }
    }
});
