import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import './authorization/Accounts';
import './layouts/layouts';
import './views/views';

BlazeLayout.setRoot('body');

if (Meteor.isClient) {
    Accounts.onLogin(function () {
        FlowRouter.go('/user');
    });

    Accounts.onLogout(function () {
        FlowRouter.go('home');
    });
}

FlowRouter.triggers.enter([function (context, redirect) {
    if (!Meteor.userId()) {
        FlowRouter.go('home');
    }
}]);

FlowRouter.route('/', {
    name: 'home',
    action() {
        if (Meteor.userId()) {
			FlowRouter.go('user');
        }
        BlazeLayout.render('Home');
    }
});

FlowRouter.route('/user', {
    name: 'user',
    action() {
        BlazeLayout.render('User');
    }
});
