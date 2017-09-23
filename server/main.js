import '/imports/mdg/methods';
import {Questions} from '/imports/collections/questionsCollection';
import {Questionnaires} from "../imports/collections/questionnairesCollection";
import {Answers} from "../imports/collections/answersCollection";

const fs = require('fs');
const PythonShell = require('python-shell');
const Future = Npm.require('fibers/future');

let path = Npm.require('path');

// Load all locations to use in future
// Meteor application structure dependent
path = path.resolve('.').split(path.sep + '.meteor')[0] + '/private';

// Full path to private folder in project
const locations = JSON.parse(fs.readFileSync(path + '/gis/countries.json', 'utf-8'));

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
        let module = JSON.parse(fs.readFileSync(path + '/knowModules/' + file, 'utf-8'));
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
    getModulesList() {
        return fs.readdirSync(path + '/knowModules/', 'utf-8');
    },
    getModuleContent(file) {
        return fs.readFileSync(path + '/knowModules/' + file, 'utf-8');
    },
    getLocation(location) {
        return getLocationList(location.inputValue, location.answerType);
    },
    callPython(model) {
        const options = {
            scriptPath: path + '/python/',
            args: [model.questionnaireId, JSON.stringify(collectAnswers(model.questionnaireId, model.userId))]
        };

        const pyShell = new PythonShell('lifecost-call.py', options);

        const thisFuture = new Future();

        pyShell.on('message', function (message) {
            // received a message sent from the Python script (a simple "print" statement)
            thisFuture.return(message);
        });

        // end the input stream and allow the process to exit
        pyShell.end(function (err) {
            if (err) throw err;
        });

        return JSON.parse(thisFuture.wait());
    },
    getCurrentLocation() {
        const ip = require('ip');

        return HTTP.get('http://ip-api.com/json/' + ip.address()).data;
    }
});

/**
 * Collect data from user answers in the questionnaire
 * @param questionnaireId
 * @param user
 * @returns {{}}
 */
function collectAnswers(questionnaireId = 'learnvest-questionnaire', user) {
    const questionnaire = Questionnaires.findOne(questionnaireId);

    if (questionnaire !== void 0) {
        const questionsId = questionnaire.questionsList;
        const questions = Questions.find({
            _id: {
                $in: questionsId
            },
            published: true
        });
        let data = {};

        if (questions.count() === questionsId.length) {

            questions.fetch().forEach((question) => {
                const answers = Answers.find({questionId: question._id, author: user});

                if (answers.count() > 0) {
                    const answer = answers.fetch()[answers.count() - 1];

                    if (question.otherAnswerType) {
                        const questionAnswer = JSON.parse(answer.answer).value;

                        if (questionAnswer !== void 0) {
                            data[question.variableName] = questionAnswer;
                        } else {
                            if (question.answersType === 1) {
                                data[question.variableName] = question.answers[answer.answer].value;
                            } else {
                                data[question.variableName] = answer.answer;
                            }
                        }
                    } else if (question.answersType > 1) {
                        data[question.variableName] = answer.answer;
                    } else {
                        data[question.variableName] = question.answers[answer.answer].value
                    }
                }
            });

            return data;
        }
    }
}

/**
 * Get list of countries or cities from countries.json and return them on client side
 * @param inputValue
 * @param answerType
 * @returns {Array}
 */
function getLocationList(inputValue, answerType) {
    const regexp = new RegExp(`.*?\\b(${inputValue.toLowerCase()})`);

    if (locations !== void 0) {
        let foundedLocations = [];

        locations.forEach((item) => {
            if (answerType === 3) {
                if (item.country.toLowerCase().match(regexp)) {
                    foundedLocations.push(item);
                }
            } else {
                if (item.city.toLowerCase().match(regexp)) {
                    foundedLocations.push(item);
                }
            }
        });

        return foundedLocations;
    }
}

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