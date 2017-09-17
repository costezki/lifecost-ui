import {ReactiveVar} from 'meteor/reactive-var';

import {UserSettings} from '/imports/collections/userCollection';
import {ErrorHandler} from "../errors/ErrorHandler";

import './UserSettings.html';

Template.UserSettings.onCreated(function () {
    Meteor.subscribe('userSettings');

    this.locations = new ReactiveVar();
    this.inputValue = new ReactiveVar();
    this.locationType = new ReactiveVar();
});

Template.UserSettings.onRendered(function () {

});

Template.UserSettings.helpers({
    UserSettings() {
        return UserSettings;
    },
    settings() {
        return UserSettings.findOne({user: Meteor.userId()});
    },
    location() {
        return Template.instance().locations.get();
    },
    locationType() {
        return Template.instance().locationType.get() === 3;
    }
});

Template.UserSettings.events({
    'input .set-country': function (event, template) {
        const inputValue = event.target.value;

        getLocation(inputValue, template, 3);
    },
    'input .set-city': function (event, template) {
        const inputValue = event.target.value;

        getLocation(inputValue, template, 4);
    },
    'click #locations li': function (event, template) {
        let location = this.country;
        const locationType = template.locationType.get();

        if (locationType !== 3) {
            location = this.city;
            $('.set-city').val(location);
        } else {
            $('.set-country').val(location);
        }

        $('#locations').find('li.collection-item').remove();
        $('#location').val(location);

        template.inputValue.set(location);
        template.locations.set(void 0);
    }
});

function getLocation(inputValue, template, answerType) {
    if (inputValue !== void 0 && inputValue !== '') {
        Meteor.call('getLocation', {inputValue, answerType}, (err, location) => {
            if (err) new ErrorHandler(err.reason);

            template.locations.set(location);
            template.locationType.set(answerType);
        });
    } else {
        template.locations.set(void 0);
    }
}