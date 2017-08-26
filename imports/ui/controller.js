import './authorization/Accounts';
import './layouts/layouts';
import './views/views';
import './partials/partials';
import './errors/ErrorHandler';

BlazeLayout.setRoot('body');

if (Meteor.isClient) {
    Accounts.onLogin(function () {

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
            FlowRouter.go('/');
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

FlowRouter.route('/questions', {
    name: 'questions',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render('User', {main: 'Questions'});
        }
    }
});

FlowRouter.route('/create-question', {
    name: 'create-question',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render('User', {main: 'CreateQuestion'});
        }
    }
});

FlowRouter.route('/edit-question/:id', {
    name: 'edit-question',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render('User', {main: 'EditQuestion'});
        }
    }
});

FlowRouter.route('/create-questionnaire', {
    name: 'create-questionnaire',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render('User', {main: 'CreateQuestionnaire'});
        }
    }
});

FlowRouter.route('/edit-questionnaire/:id', {
    name: 'edit-questionnaire',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render('User', {main: 'EditQuestionnaire'});
        }
    }
});

FlowRouter.route('/show-questionnaire/:id', {
    name: 'show-questionnaire',
    action() {
        BlazeLayout.render('User', {main: 'ShowQuestionnaire'});
    }
});

FlowRouter.route('/published-questions', {
    name: 'published-questions',
    action() {
        BlazeLayout.render('User', {main: 'PublishedQuestions'});
    }
});

FlowRouter.route('/add-answer/:id', {
    name: 'add-answer',
    action() {
        BlazeLayout.render('User', {main: 'AddAnswers'});
    }
});

FlowRouter.route('/answers', {
    name: 'answers',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render('User', {main: 'ShowAnswers'});
        }
    }
});

FlowRouter.route('/settings', {
    name: 'settings',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render('User', {main: 'UserSettings'});
        }
    }
});
