import {ReactiveVar} from 'meteor/reactive-var';

import {Questions} from '/imports/collections/questionsCollection';
import {Questionnaires} from '/imports/collections/questionnairesCollection';
import {Answers} from '/imports/collections/answersCollection';
import {updatePublicationQuestion, updatePublicationQuestionnaire} from './utils';
import {ErrorHandler} from "../errors/ErrorHandler";

import './Questions.html';

Template.Questions.onCreated(function () {
    Meteor.subscribe('questions');
    Meteor.subscribe('questionnaire');

    this.modules = new ReactiveVar();
    this.moduleContent = new ReactiveVar();

    Meteor.call('getModules', (err, modules) => {
        if (err) new ErrorHandler(err.reason, "rounded");

        this.modules.set(modules);
    });
});

Template.Questions.onRendered(function () {
    $('.modal').modal();
    $('ul.tabs').tabs();
    $('.collapsible').collapsible();
});

Template.Questions.helpers({
    Questions() {
        return Questions.find({author: Meteor.userId()});
    },
    // questionsCount() {
    //     let questions = Questions.find({author: Meteor.userId()});
    //
    //     if (questions.count() > 2) return "hidden";
    // },
    Questionnaires() {
        return Questionnaires.find({author: Meteor.userId()});
    },
    modules() {
        return Template.instance().modules.get();
    },
    moduleContent() {
        return Template.instance().moduleContent.get();
    }
});

Template.Questions.events({
    'click .delete': function () {
        if (this.title) {
            let deleteQuestionnaire = confirm("Delete this questionnaire?\n\"" + this.title + "\"");

            if (deleteQuestionnaire) {
                Questionnaires.remove(this._id);
            }
        } else {
            let deleteQuestion = confirm("Delete this question?\n\"" + this.question + "\"");

            if (deleteQuestion) {
                let answers = Answers.find({questionId: this._id});

                if (answers.count() > 0) {
                    Questions.update(this._id, {
                        $set: {
                            deprecated: true,
                            published: false,
                            publishedDate: null
                        }
                    }, (err) => {
                        if (err) new ErrorHandler(err.reason, "rounded");
                    });
                } else {
                    Questions.remove(this._id);
                }
            }
        }
    },
    'click .make-publish': function () {
        let question = Questions.findOne(this._id);
        let questionnaire = Questionnaires.findOne(this._id);

        if (question !== void 0) {
            let published = question.published;

            updatePublicationQuestion(this._id, !published, published ? null : new Date(), false);
        } else if (questionnaire !== void 0) {
            let published = questionnaire.published;

            updatePublicationQuestionnaire(this._id, !published, published ? null : new Date());
        }
    },
    'click .insert-module'() {
        let module = this.trim('');

        if (module !== "" && module !== void 0) {
            Meteor.call('createDefaultQuestionnaire', module, (err) => {
                if (err) new ErrorHandler(err.reason + ". Check module fields");
            });
        }
    },
    'click #create-questionnaire': function () {
        let questions = Questions.find({author: Meteor.userId(), published: true});

        if (questions.count() > 1) {
            $('#create-questions').modal('close');
            FlowRouter.go('/create-questionnaire');
        } else {
            new ErrorHandler("You must have 2 or more created questions and published, to create questionnaire!", "rounded");
        }
    },
    'click .show-module': function (event, template) {
        let module = this.trim('');

        if (module !== "" && module !== void 0) {
            Meteor.call('getModuleContent', module, (err, content) => {
                if (err) new ErrorHandler(err.reason, "rounded");
                template.moduleContent.set(content);
            });
        }
    },
    'click #end-module-view'() {
        $('#module-content').modal('close');
        $('.collapsible').collapsible('open', 3);
    }
});
