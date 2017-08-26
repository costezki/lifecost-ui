import {Questions} from '/imports/collections/questionsCollection';
import {Questionnaires} from '/imports/collections/questionnairesCollection';

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
        let questionnaires = Questionnaires.find();

        if (questionnaires.count() > 0) {
            let publishedQuestionnaires = [];

            questionnaires.fetch().forEach(function (questionnaire) {
                let questions = Questions.find({
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
                    })
                }
            });

            return publishedQuestionnaires;
        }
    }
});

Template.PublishedQuestions.events({
    'click .delete-question': function () {
        let deleteQuestion = confirm("Delete this question?\n\"" + this.question + "\"");

        if (deleteQuestion) {
            Questions.remove(this._id);
        }
    },
    'click .make-publish': function (event) {
        let published = Questions.findOne(this._id);

        if (published.published) {
            Questions.update(this._id, {$set: {published: false, publishedDate: null}});
        } else {
            Questions.update(this._id, {$set: {published: true, publishedDate: new Date()}});
        }
    }
});
