import {SignUp} from '/imports/ui/authorization/Accounts';
import {ErrorHandler} from "../../errors/ErrorHandler";

import './SignUp.html';

Template.SignUp.onCreated(function () {
    AutoForm.addFormType('signUpForm');
    AutoForm.addHooks('signUpForm', {
        // Called when any submit operation succeeds
        onSuccess: function () {
            const settings = this.insertDoc;

            Meteor.loginWithPassword(settings.email, settings.password, (err) => {
                if (err) new ErrorHandler(err.reason, "rounded");
                location.reload();
            });
        }
    })
});

Template.SignUp.helpers({
    SignUp() {
        return SignUp;
    }
});
