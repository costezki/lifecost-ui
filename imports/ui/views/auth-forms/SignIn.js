import {SignIn} from '/imports/ui/authorization/Accounts';
import {ErrorHandler} from "../../errors/ErrorHandler";

import './SignIn.html';

Template.SignIn.onCreated(function () {
    AutoForm.addFormType('signInForm');
    AutoForm.addHooks('signInForm', {
        onSubmit: function (insertDoc) {
            this.done(null, insertDoc); // submitted successfully, call onSuccess

            return false;
        },
        onSuccess: function (formType, settings) {
            Meteor.loginWithPassword(settings.email, settings.password, (err) => {
                if (err) new ErrorHandler(err.reason, "rounded");
                location.reload();
            });
        }
    })
});

Template.SignIn.helpers({
    SignIn() {
        return SignIn;
    }
});
