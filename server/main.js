import {addAnswer} from '/imports/mdg/methods';
import {Questions} from '/imports/collections/questionsCollection';
import {Questionnaires} from "../imports/collections/questionnairesCollection";

Meteor.startup(() => {
    // code to run on server at startup
});

Meteor.methods({
    'checkKey'(key) {
        return key === Meteor.settings.private.secretKey;
    },
    'change-role'() {
        let userBirthday = Meteor.users.findOne(Meteor.userId()).profile.birthday;

        Meteor.users.update(
            Meteor.userId(),
            {
                $set: {
                    profile: {
                        role: 'admin',
                        birthday: userBirthday
                    }
                }
            }
        );
    },
    'createDefaultQuestionnaire': function () {
        // Get default questions with HTTP request from json file on public folder
        let defaultQuestions = HTTP.get(Meteor.absoluteUrl('json/defaultQuestions.json')).data;
        // Get existing questions with field="variableName" from mongodb, if they exists
        let existingQuestions = Questions.find({author: this.userId, variableName: {$exists: true}});
        // Get default questionnaire if he exist
        let defaultQuestionnaire = Questionnaires.findOne('default_questionnaire');

        let userId = this.userId;

        addDefaultQuestions(defaultQuestions.questionsList, existingQuestions, userId);

        addDefaultQuestionnaire(
            getQuestionsIds(existingQuestions),
            defaultQuestionnaire,
            userId,
            defaultQuestions.title);
    }
});

/**
 * Insert into mongodb default questions from defaultQuestions.json
 * @param defaultQuestions
 * @param existingQuestions
 * @param userId
 */
function addDefaultQuestions(defaultQuestions, existingQuestions, userId) {
    // Each question in json data
    defaultQuestions.forEach(function (question) {
        // This flag say, when question can be add in mongodb
        let flag = true;

        if (existingQuestions.count() > 0) {
            // Each existing questions with filed="variableName" and compare with default question from json data
            existingQuestions.fetch().forEach(function (exQuestion) {
                if (exQuestion.variableName === question.variableName) {
                    flag = false;
                }
            });
        }

        // If flag=true then insert new question into mongodb from json data
        if (flag) {
            question.author = userId;
            question.publishedDate = new Date();
            question.createdAt = new Date();

            Questions.insert(question);
        }
    });
}

/**
 * Get questions ids with and filed="variableName" from mongodb, and return array with ids
 * @param existingQuestions
 * @returns {Array}
 */
function getQuestionsIds(existingQuestions) {
    // After creating the missing questions, create a list with their ids
    let existingQuestionsIds = [];

    if (existingQuestions.count() > 0) {
        // Each default question from mongodb and push their ids into array
        existingQuestions.fetch().forEach(function (question) {
            existingQuestionsIds.push(question._id);
        });
    }

    return existingQuestionsIds;
}

/**
 * Create or update default questionnaire with default questions from defaultQuestions.json or mongodb
 * @param existingQuestionsIds
 * @param defaultQuestionnaire
 * @param userId
 */
function addDefaultQuestionnaire(existingQuestionsIds, defaultQuestionnaire, userId, title) {
    if (defaultQuestionnaire !== void 0) {
        // Update field questionsList on existing default questionnaire
        Questionnaires.update('default_questionnaire', {
            $set: {
                questionsList: existingQuestionsIds
            }
        });
    } else {
        // Add into mongodb default questionnaire with default questions from json file
        // or from mongodb, if they exists
        Questionnaires.insert({
            _id: 'default_questionnaire',
            author: userId,
            title: title,
            questionsList: existingQuestionsIds,
            createdAt: new Date,
            publishedAt: new Date(),
            published: true
        });
    }
}