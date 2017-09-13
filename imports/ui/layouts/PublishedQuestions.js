import {Questions} from '/imports/collections/questionsCollection';
import {Questionnaires} from '/imports/collections/questionnairesCollection';
import {ErrorHandler} from "../errors/ErrorHandler";

import './PublishedQuestions.html';

Template.PublishedQuestions.onCreated(function () {
    Meteor.subscribe('userSettings');
    Meteor.subscribe('questionnaires');
});

Template.PublishedQuestions.onRendered(function () {
    $('ul.tabs').tabs();
});

Template.PublishedQuestions.helpers({
    Questions() {
        return Questions.find();
    },
    questionnaires() {
        const questionnaires = Questionnaires.find();

        if (questionnaires.count() > 0) {
            let publishedQuestionnaires = [];

            questionnaires.fetch().forEach(function (questionnaire) {
                const questions = Questions.find({
                    _id: {
                        $in: questionnaire.questionsList
                    },
                    published: true
                });

                if (questions.count() > 1) {
                    publishedQuestionnaires.push(questionnaire);
                } else {
                    Questionnaires.update(questionnaire._id, {
                        $set: {
                            published: false,
                            publishedAt: null
                        }
                    }, (err) => {
                        if (err) new ErrorHandler(err, "rounded");
                    })
                }
            });

            return publishedQuestionnaires;
        }
    }
});

Template.PublishedQuestions.events({
    'click .delete-question': function () {
        const deleteQuestion = confirm("Delete this question?\n\"" + this.question + "\"");

        if (deleteQuestion) {
            Questions.remove(this._id, (err) => {
                if (err) new ErrorHandler(err, "rounded");
            });
        }
    }
});
