import {showCompletedQuestionnaires} from "./utils";

import './ShowStatistics.html';

Template.ShowStatistics.onCreated(function () {

});

Template.ShowStatistics.helpers({
    questionnaires() {
        return showCompletedQuestionnaires();
    }
});