import '/imports/mdg/methods';
import {Questions} from '/imports/collections/questionsCollection';
import {Questionnaires} from "../imports/collections/questionnairesCollection";

let fs = require('fs');

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
    'createDefaultQuestionnaire': function (file) {
        // Get default questions with node-js plugin from module on knowModules folder
        let module = JSON.parse(fs.readFileSync('/knowModules/' + file, 'utf-8'));
        // Get existing questions with field="variableName" from mongodb, if they exists
        let existingQuestions = Questions.find({author: this.userId, variableName: {$exists: true}});
        // Get default questionnaire if he exist
        let defaultQuestionnaire = Questionnaires.findOne(module.id);

        let userId = this.userId;

        addDefaultQuestions(module.questionsList, existingQuestions, userId);

        addDefaultQuestionnaire(
            getQuestionsIds(module.questionsList, existingQuestions),
            defaultQuestionnaire,
            userId,
            module.title,
            module.id);
    },
    getModules() {
        // Get list of existing modules
        return fs.readdirSync('/knowModules/', 'utf-8');
    },
    getModuleContent(file) {
        return fs.readFileSync('/knowModules/' + file, 'utf-8');
    }
});

/**
 * Insert into mongodb default questions from existing module
 * @param defaultQuestions
 * @param existingQuestions
 * @param userId
 */
function addDefaultQuestions(defaultQuestions, existingQuestions, userId) {
    // Each question in module
    defaultQuestions.forEach(function (question) {
        // This flag say, when question can be add in mongodb
        let flag = true;

        if (existingQuestions.count() > 0) {
            // Each existing questions with filed="variableName" and compare with default question from module
            existingQuestions.fetch().forEach(function (exQuestion) {
                if (exQuestion.variableName === question.variableName) {
                    flag = false;
                }
            });
        }

        // If flag=true then insert new question into mongodb from module
        if (flag) {
            question.author = userId;
            question.publishedDate = new Date();
            question.createdAt = new Date();

            Questions.insert(question);
        }
    });
}

/**
 * Get questions ids with filed="variableName" from mongodb, and return array with ids
 * @param defaultQuestions
 * @param existingQuestions
 * @returns {Array}
 */
function getQuestionsIds(defaultQuestions, existingQuestions) {
    // After creating the missing questions, create a list with their ids
    let existingQuestionsIds = [];
    // Each question in mongodb
    existingQuestions.fetch().forEach(function (exQuestion) {
        // This flag say, when question can be add in to existing questions ids
        let flag = false;

        defaultQuestions.forEach(function (question) {
            // Each existing questions with filed="variableName" and compare with default question from module
            if (exQuestion.variableName === question.variableName) {
                flag = true;
            }
        });

        if (flag) existingQuestionsIds.push(exQuestion._id);
    });

    return existingQuestionsIds;
}

/**
 * Create or update default questionnaire with default questions from existing module or mongodb
 * @param existingQuestionsIds
 * @param defaultQuestionnaire
 * @param userId
 * @param title
 * @param id
 */
function addDefaultQuestionnaire(existingQuestionsIds, defaultQuestionnaire, userId, title, id) {
    if (defaultQuestionnaire !== void 0) {
        // Update field questionsList on existing default questionnaire
        Questionnaires.update(id, {
            $set: {
                questionsList: existingQuestionsIds
            }
        }, (err) => {
            if (err) throw new Error(err);
        });
    } else {
        // Add into mongodb default questionnaire with default questions from module
        // or mongodb, if they exists
        Questionnaires.insert({
            _id: id,
            author: userId,
            title: title,
            questionsList: existingQuestionsIds,
            createdAt: new Date,
            publishedAt: new Date(),
            published: true
        });
    }
}