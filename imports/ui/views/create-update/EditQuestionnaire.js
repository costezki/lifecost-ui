import {Questions} from '/imports/collections/questionsCollection';
import {Questionnaires} from '/imports/collections/questionnairesCollection';
import {updateQuestionnaire} from '../utils';
import {ErrorHandler} from "../../errors/ErrorHandler";

import './EditQuestionnaire.html';

Template.EditQuestionnaire.onCreated(function () {
    Meteor.subscribe('questions');
});

Template.EditQuestionnaire.onRendered(function () {
    let questionnaireList = document.getElementById('questions-list');
    let availableList = document.getElementById('available-list');
    let sortableSettings = {
        animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
        dragClass: 'sortable-drag',
        group: 'questionnaire'
    };

    Sortable.create(questionnaireList, sortableSettings);
    Sortable.create(availableList, sortableSettings);
});

Template.EditQuestionnaire.helpers({
    available() {
        let questionnaire = Questionnaires.findOne(FlowRouter.getParam('id'));

        if (questionnaire !== void 0) {
            return Questions.find({
                _id: {
                    $nin: questionnaire.questionsList
                },
                published: true
            });
        }
    },
    questionnaire() {
        let questionnaire = Questionnaires.findOne(FlowRouter.getParam('id'));

        if (questionnaire !== void 0) {
            return questionnaire.questionsList;
        }
    },
    questionnaireTitle() {
        let questionnaire = Questionnaires.findOne(FlowRouter.getParam('id'));

        if (questionnaire !== void 0) {
            return questionnaire.title;
        }
    }
});

Template.EditQuestionnaire.events({
    'submit #update-questionnaire': function (event, template) {
        event.preventDefault();

        let questionnaireList = $(event.target).find('#questions-list').children();

        let questions = [];

        for (let i = 0; i < questionnaireList.length; i++) {
            questions.push(questionnaireList[i].id);
        }

        if (questions.length > 1) {
            let title = event.target['questionnaire-title'].value.trim();
            updateQuestionnaire(FlowRouter.getParam('id'), title, questions);
        } else {
            new ErrorHandler(
                "You must have 2 or more question in questionnaire to update him...",
                "rounded",
                null,
                "warning",
            );
        }
    }
});
