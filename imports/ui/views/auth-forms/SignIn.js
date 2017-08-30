import { SignIn } from '/imports/ui/authorization/Accounts';
import {ErrorHandler} from "../../errors/ErrorHandler";

import './SignIn.html';

Template.SignIn.onCreated(function() {
	AutoForm.addFormType('signInForm');
	AutoForm.addHooks('signInForm', {
		onSubmit: function(insertDoc, updateDoc, currentDoc) {
			this.done(null, insertDoc); // submitted successfully, call onSuccess
			// this.done(new Error('foo')); // failed to submit, call onError with the provided error
			// this.done(null, "foo"); // submitted successfully, call onSuccess with `result` arg set to "foo"
			return false;
		},
		onSuccess: function(formType, settings) {
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
