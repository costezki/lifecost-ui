import {addAnswer} from '/imports/mdg/methods';
import {Questions} from '/imports/collections/questionsCollection';
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
        if (err) new ErrorHandler(err.reason, "rounded");
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
        if (err) new ErrorHandler(err.reason, "rounded");
        FlowRouter.go('/questions');
    });
}

export function qqList(questionnaireId) {
    let questionnaire = Questionnaires.findOne(questionnaireId);

    if (questionnaire !== void 0) {
        let questionsIds = questionnaire.questionsList;

        let questions = Questions.find(
            {
                _id: {
                    $in: questionsIds
                },
                published: false
            }
        );

        if (questions.count() > 0) {
            questions.fetch().forEach(function (question) {
                let index = questionsIds.indexOf(question._id);

                if (index > -1) {
                    questionsIds.splice(index, 1);
                }
            });
        }

        return questionsIds;
    }
}

export function questionnaireInsertAnswer(answer, questionId, template) {
    addAnswer.call({answer, questionId}, (err) => {
        if (err) new ErrorHandler(err.reason, "rounded");

        let activeQuestion = template.parent().activeQuestion.get();
        let activeQuestionNumber = activeQuestion.questionNumber;
        let questionnaire = Questionnaires.findOne(FlowRouter.getParam('id'));

        if (questionnaire !== void 0) {
            let questions = Questions.find({_id: {$in: questionnaire.questionsList}, published: true});
            let clearedQuestions = template.parent().clearedQuestions.get();

            template.parent().clearedQuestions.get()[clearedQuestions.length - 1].cleared = true;

            if (questions.count() > activeQuestionNumber + 1) {
                $('.pagination').find('li').removeClass('active');
                $('.pagination').find('li:nth-child(' + (activeQuestionNumber + 2) + ')').addClass('active');

                let nextQuestion = {
                    questionNumber: activeQuestionNumber + 1,
                    cleared: false
                };

                clearedQuestions.push(nextQuestion);

                template.parent().clearedQuestions.set(clearedQuestions);
                template.parent().activeQuestion.set(nextQuestion);
            } else {
                FlowRouter.go('/published-questions');
            }
        }
    });
}

export function updatePublicationQuestionnaire(questionnaireId, published, date) {
    let questionnaire = Questionnaires.findOne(questionnaireId);

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
            if (err) new ErrorHandler(err.reason, "rounded");
        });
    }
}

export function insertAnswer(answer, questionId) {
    addAnswer.call({answer, questionId}, (err) => {
        if (err) new ErrorHandler(err.reason, "rounded");
    });
}

export function updatePublicationQuestion(questionId, published, date, deprecated) {
    Questions.update(questionId, {
        $set: {
            published: published,
            publishedDate: date,
            deprecated: deprecated
        }
    }, (err) => {
        if (err) new ErrorHandler(err.reason, "rounded");
    });
}
