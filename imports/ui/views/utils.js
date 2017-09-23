import {addAnswer} from '/imports/mdg/methods';
import {Questions} from '/imports/collections/questionsCollection';
import {Answers} from "/imports/collections/answersCollection";
import {Questionnaires} from '/imports/collections/questionnairesCollection';
import {ErrorHandler} from "../errors/ErrorHandler";

export function insertQuestionnaire(published, title, date, questions) {
    Questionnaires.insert({
        author: Meteor.userId(),
        title: title,
        questionsList: questions,
        createdAt: new Date(),
        published: published,
        publishedAt: date
    }, (err) => {
        if (err) new ErrorHandler(err, "rounded");

        FlowRouter.go('/questions');
    });
}

export function updateQuestionnaire(id, title, questions) {
    Questionnaires.update(id, {
        $set: {
            questionsList: questions,
            title: title,
            createdAt: new Date()
        }
    }, (err) => {
        if (err) new ErrorHandler(err, "rounded");

        FlowRouter.go('/questions');
    });
}

export function qqList(questionnaireId) {
    const questionnaire = Questionnaires.findOne(questionnaireId);

    if (questionnaire !== void 0) {
        const questionsIds = questionnaire.questionsList;

        const questions = Questions.find(
            {
                _id: {
                    $in: questionsIds
                },
                published: false
            }
        );

        if (questions.count() > 0) {
            questions.fetch().forEach(function (question) {
                const index = questionsIds.indexOf(question._id);

                if (index > -1) {
                    questionsIds.splice(index, 1);
                }
            });
        }

        return questionsIds;
    }
}

export function updatePublicationQuestionnaire(questionnaireId, published, date) {
    const questionnaire = Questionnaires.findOne(questionnaireId);

    if (questionnaire !== void 0) {
        if (published) {
            let questions = Questions.find({
                _id: {
                    $in: questionnaire.questionsList
                },
                published: true
            });

            if (questions.count() < 2) {
                new ErrorHandler(
                    "To publish this questionnaire you must have 2 or more published questions...",
                    null,
                    null,
                    "warning"
                );

                return false;
            }
        }

        Questionnaires.update(questionnaireId, {
            $set: {
                published: published,
                publishedAt: date
            }
        }, (err) => {
            if (err) new ErrorHandler(err, "rounded");
        });
    }
}

export function insertAnswer(answer, questionId, template, questionnaire) {
    addAnswer.call({answer, questionId}, (err) => {
        if (err) new ErrorHandler(err, "rounded");

        if (questionnaire !== void 0) {
            const questionnaireId = FlowRouter.getParam('id');
            const activeQuestion = template.parent().activeQuestion.get();
            const activeQuestionNumber = activeQuestion.questionNumber;
            const questionnaire = Questionnaires.findOne(questionnaireId);

            if (questionnaire !== void 0) {
                const questions = Questions.find({_id: {$in: questionnaire.questionsList}, published: true});
                const clearedQuestions = template.parent().clearedQuestions.get();

                template.parent().clearedQuestions.get()[clearedQuestions.length - 1].cleared = true;

                if (questions.count() > activeQuestionNumber + 1) {
                    $('.pagination').find('li').removeClass('active');
                    $('.pagination').find('li:nth-child(' + (activeQuestionNumber + 2) + ')').addClass('active');

                    const nextQuestion = {
                        questionNumber: activeQuestionNumber + 1,
                        cleared: false
                    };

                    clearedQuestions.push(nextQuestion);

                    template.parent().clearedQuestions.set(clearedQuestions);
                    template.parent().activeQuestion.set(nextQuestion);
                } else {
                    FlowRouter.go(`/questionnaire-statistic/${questionnaireId}`);
                }
            }
        }
    });
}

export function checkLocation(location, inputValue, locationType, questionId, template, isQuestionnaire) {
    if (location[0][locationType].toLocaleLowerCase() === inputValue.toLocaleLowerCase()) {
        insertAnswer(JSON.stringify(location[0]), questionId, template, isQuestionnaire);
    } else {
        new ErrorHandler(`Select ${locationType} from list or input correct word!`, null, null, 'warning')
    }
}

export function updatePublicationQuestion(questionId, published, date, deprecated) {
    Questions.update(questionId, {
        $set: {
            published: published,
            publishedDate: date,
            deprecated: deprecated
        }
    }, (err) => {
        if (err) new ErrorHandler(err, "rounded");
    });
}

export function showCompletedQuestionnaires() {
    const questionnaires = Questionnaires.find();

    if (questionnaires.count() > 0) {
        let completed = [];

        questionnaires.forEach((questionnaire) => {
            const questionsIds = questionnaire.questionsList;
            let flag = true;

            questionsIds.map((id) => {
                const answer = Answers.findOne({questionId: id, author: Meteor.userId()});

                if (answer === void 0) flag = false;
            });

            if (flag) completed.push(questionnaire);
        });

        return completed;
    }
}

export function getAnswerValue(question, questionId) {
    const answers = Answers.find({questionId: questionId, author: Meteor.userId()});

    if (answers.count() > 0) {
        const answer = answers.fetch()[answers.count() - 1];

        if (question.otherAnswerType) {
            const questionAnswer = JSON.parse(answer.answer).value;

            if (questionAnswer !== void 0) {
                return questionAnswer;
            } else {
                if (question.answersType === 1) {
                    return question.answers[answer.answer].value;
                } else {
                    return answer.answer;
                }
            }
        } else if (question.answersType > 1) {
            return answer.answer;
        } else {
            return question.answers[answer.answer].value
        }
    }
}