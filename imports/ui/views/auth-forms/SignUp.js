import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SignUp } from '/imports/ui/authorization/Accounts';

import './SignUp.html';

Template.SignUp.onCreated(function() {
	AutoForm.addFormType('signUpForm')
	AutoForm.addHooks('signUpForm', {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			let settings = this.insertDoc;

			Meteor.loginWithPassword(settings.email, settings.password, (err) => {
				if (err) throw new Error(err);
				location.reload();
			});
		},

		// Called when any submit operation fails
		onError: function(formType, err) {
			if (err !== void 0 && err.reason !== void 0) {
				alert(err.reason);
			}
		}
	})
});

Template.SignUp.helpers({
	SignUp() {
		return SignUp;
	}
});

Template.SignUp.events({

});
