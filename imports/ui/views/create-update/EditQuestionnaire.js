import {Questions} from '/imports/collections/questionsCollection';
import {Questionnaires} from '/imports/collections/questionnairesCollection';
import {updateQuestionnaire} from '../utils';
import {ErrorHandler} from "../../errors/ErrorHandler";

import './EditQuestionnaire.html';

Template.EditQuestionnaire.onCreated(function () {
    Meteor.subscribe('questions');
});

Template.EditQuestionnaire.onRendered(function () {
    const questionnaireList = document.getElementById('questions-list');
    const availableList = document.getElementById('available-list');
    const sortableSettings = {
        animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
        dragClass: 'sortable-drag',
        group: 'questionnaire'
    };

    Materialize.updateTextFields();

    Sortable.create(questionnaireList, sortableSettings);
    Sortable.create(availableList, sortableSettings);
});

Template.EditQuestionnaire.helpers({
    available() {
        const questionnaire = Questionnaires.findOne(FlowRouter.getParam('id'));

        if (questionnaire !== void 0) {
            return Questions.find({
                author: Meteor.userId(),
                _id: {
                    $nin: questionnaire.questionsList
                },
                published: true
            });
        }
    },
    questionnaire() {
        const questionnaire = Questionnaires.findOne(FlowRouter.getParam('id'));

        if (questionnaire !== void 0) {
            return questionnaire.questionsList;
        }
    },
    questionnaireTitle() {
        const questionnaire = Questionnaires.findOne(FlowRouter.getParam('id'));

        if (questionnaire !== void 0) {
            return questionnaire.title;
        }
    }
});

Template.EditQuestionnaire.events({
    'submit #update-questionnaire': function (event, template) {
        event.preventDefault();

        const questionnaireList = $(event.target).find('#questions-list').children();

        let questions = [];

        questionnaireList.forEach((item) => {
            questions.push(item.id);
        });

        if (questions.length > 1) {
            const title = event.target['questionnaire-title'].value.trim();

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
