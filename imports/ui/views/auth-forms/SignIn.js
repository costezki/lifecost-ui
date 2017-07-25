import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SignIn } from '/imports/ui/authorization/Accounts';

import './SignIn.html';

Template.SignIn.onCreated(function() {
	AutoForm.addFormType('signInForm')
	AutoForm.addHooks('signInForm', {
		// Called when form does not have a `type` attribute
		onSubmit: function(insertDoc, updateDoc, currentDoc) {
			// You must call this.done()!
			this.done(null, insertDoc); // submitted successfully, call onSuccess
			// this.done(new Error('foo')); // failed to submit, call onError with the provided error
			// this.done(null, "foo"); // submitted successfully, call onSuccess with `result` arg set to "foo"
			return false;
		},
		// Called when any submit operation succeeds
		onSuccess: function(formType, settings) {
			Meteor.loginWithPassword(settings.email, settings.password, (err) => {
				if (err) throw new Error(err);
				location.reload();
			});
		},

		// Called when any submit operation fails
		onError: function(formType, error) {
			// alert("Fatal error!");
		},
	})
});

Template.SignIn.helpers({
	SignIn() {
		return SignIn;
	}
});

Template.SignIn.events({

});
