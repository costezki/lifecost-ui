import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './Home.html';

Template.Home.onCreated(function() {

});

Template.Home.onRendered(function() {
	$('ul.tabs').tabs();
});
