import {ReactiveVar} from 'meteor/reactive-var';

import {Questions} from '/imports/collections/questionsCollection';
import {insertQuestionnaire} from '../utils';

import './CreateQuestionnaire.html';

Template.CreateQuestionnaire.onCreated(function () {
    Meteor.subscribe('questions');

    this.published = new ReactiveVar(false);
});

Template.CreateQuestionnaire.onRendered(function () {
    const questionnaireList = document.getElementById('questions-list');
    const availableList = document.getElementById('available-list');
    const sortableSettings = {
        animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
        dragClass: 'sortable-drag',
        group: 'questionnaire'
    };

    Sortable.create(questionnaireList, sortableSettings);
    Sortable.create(availableList, sortableSettings);
});

Template.CreateQuestionnaire.helpers({
    published() {
        return Template.instance().published.get();
    },
    available() {
        return Questions.find({author: Meteor.userId(), published: true});
    }
});

Template.CreateQuestionnaire.events({
    'submit #create-questionnaire': function (event, template) {
        event.preventDefault();

        const questionnaireList = $('#questions-list').children();

        let questions = [];

        for (let i = 0; i < questionnaireList.length; i++) {
            questions.push(questionnaireList.id)
        }

        if (questions.length > 1) {
            const title = event.target['questionnaire-title'].value.trim();
            const published = template.published.get();

            insertQuestionnaire(published, title, published ? new Date() : null, questions);
        }
    },
    'click .make-publish': function (event, template) {
        template.published.set(!template.published.get());
    }
});
