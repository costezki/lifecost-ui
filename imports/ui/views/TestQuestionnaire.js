import { Questions } from '/imports/collections/questionsCollection';
import { Questionnaires } from '/imports/collections/questionnairesCollection';
import { Answers, AnswersSchemaFactory } from '/imports/collections/answersCollection';

import './TestQuestionnaire.html';

Template.QuestionnaireAddAnswer.onCreated(function() {
	AutoForm.addHooks('insertAnswer', {
		onSubmit: function(insertDoc, updateDoc, currentDoc) {
			this.done(insertDoc); // submitted successfully, call onSuccess
		},
		onSuccess: function(formType, answerId) {
			let questionnaire = Questionnaires.findOne(FlowRouter.getParam('id'));
			let index = Template.currentData().questionNumber;
			let questionId = questionnaire.questionsList[index - 1];
			let question = Questions.findOne(questionId);

			Answers.update(
				answerId,
				{
					$set:{
						questionId: question.questionId
					},
				}
			), (err, res) => {
				if (err) throw new Error(err);
				console.log(Template.ShowQuestionnaire.pageNumber);
			};
		},
	}, true);
});

Template.QuestionnaireAddAnswer.helpers({
	question() {
		let questionnaire = Questionnaires.findOne(FlowRouter.getParam('id'));

		if (questionnaire !== void 0) {
			let index = Template.currentData().questionNumber;
			let questionId = questionnaire.questionsList[index - 1];
			let question = Questions.findOne(questionId);

			if (question !== void 0) {
				return question;
			}
		}
	},
	answersSchema() {
		let questionnaire = Questionnaires.findOne(FlowRouter.getParam('id'));

		if (questionnaire !== void 0) {
			let index = Template.currentData().questionNumber;
			let questionId = questionnaire.questionsList[index - 1];
			let question = Questions.findOne(questionId);

			if (question !== void 0) {
				let answerType = question.answersType;
				let answers = [];

				if (answerType !== 2) {
					question.answers.forEach(function(item, index) {
						answers.push({
							label: item,
							value: index
						});
					});
				}

				return new AnswersSchemaFactory(answers, answerType).getSchema();
			}
		}
	},
	answersCollection() {
		return Answers;
	}
});
