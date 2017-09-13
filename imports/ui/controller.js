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

function createRouter(link, name, userAccess, layout, template) {
    FlowRouter.route(link, {
        name: name,
        action() {
            if (userAccess && Meteor.userId()) {
                BlazeLayout.render(layout, {main: template});
            } else {
                BlazeLayout.render(layout, {main: template});
            }
        }
    });
}

createRouter('/questions', 'questions', true, 'User', 'Questions');
createRouter('/create-question', 'create-question', true, 'User', 'CreateQuestion');
createRouter('/edit-question/:id', 'edit-question', true, 'User', 'EditQuestion');
createRouter('/create-questionnaire', 'create-questionnaire', true, 'User', 'CreateQuestionnaire');
createRouter('/edit-questionnaire/:id', 'edit-questionnaire', true, 'User', 'EditQuestionnaire');
createRouter('/show-questionnaire/:id', 'show-questionnaire', false, 'User', 'ShowQuestionnaire');
createRouter('/published-questions', 'published-questions', false, 'User', 'PublishedQuestions');
createRouter('/add-answer/:id', 'add-answer', false, 'User', 'AddAnswers');
createRouter('/answers', 'answers', true, 'User', 'ShowAnswers');
createRouter('/settings', 'settings', true, 'User', 'UserSettings');
