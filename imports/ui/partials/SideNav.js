import {Questions} from '/imports/collections/questionsCollection';
import {Questionnaires} from '/imports/collections/questionnairesCollection';
import {Answers} from '/imports/collections/answersCollection';
import {UserSettings} from '/imports/collections/userCollection';
import {ErrorHandler} from "../errors/ErrorHandler";

import './SideNav.html';

Template.SideNav.onCreated(function () {
    Meteor.subscribe('questions');
    Meteor.subscribe('questionnaires');
    Meteor.subscribe('answers');
    Meteor.subscribe('userSettings');
});

Template.SideNav.onRendered(function () {
    /** Modals **/
    $('.modal').modal({
        complete: function () {
            $('.collapsible-header').removeClass(function () {
                return 'active';
            });
            $('.collapsible').collapsible({accordion: true});
            $('.collapsible').collapsible({accordion: false});
        } // Callback for Modal closeA
    });

    /** Collapsible blocks **/
    $('.collapsible').collapsible({
        accordion: false, // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        onOpen: function (el) {
            console.log(el);
        }, // Callback for Collapsible open
        onClose: function (el) {
            console.log(el);
        } // Callback for Collapsible close
    });

    $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: false, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'right', // Displays dropdown with edge aligned to the left of button
            stopPropagation: false // Stops event propagation
        }
    );
});

Template.SideNav.helpers({
    userSettings() {
        return UserSettings.findOne({user: Meteor.userId()});
    },
    questionsLength() {
        let questionsLength = Questions.find({author: Meteor.userId()}).count()
        let questionnairesLength = Questionnaires.find({author: Meteor.userId()}).count();
        return questionsLength + questionnairesLength;
    },
    myAnswers() {
        let answers = Answers.find({author: Meteor.userId()});
        if (answers.count() > 0) {
            let questions = [];
            let questionsIds = [];

            answers.fetch().forEach(function (item) {
                let question = Questions.findOne(item.questionId);

                if (question !== void 0) {
                    let flag = false;

                    questionsIds.forEach(function (id) {
                        if (item.questionId === id) {
                            flag = true;
                            return false;
                        }
                    });

                    if (!flag) {
                        questions.push(question);
                    }
                }
                questionsIds.push(item.questionId);
            });
            return questions.length;
        } else {
            return 0;
        }
    }
});

Template.SideNav.events({
    'click #logout-btn'() {
        Accounts.logout();
    },
    'click #edit-profile'() {
        FlowRouter.go('/settings');
    },
    'submit #unlock-role'(event) {
        event.preventDefault();

        let secretKey = event.target['secret-key'].value;

        Meteor.call('checkKey', secretKey, (err, res) => {
            if (err) new ErrorHandler(err.reason, "rounded");

            if (res) {
                Meteor.call('change-role', (err, res) => {
                    if (err) new ErrorHandler(err.reason, "rounded");
                    $('#input-role-secret-key').modal('close');
                    $('#buy-role').modal('close');
                });
            } else {
                alert('Your key is broken!\nPlease try another key.');
            }
        })
    }
});
