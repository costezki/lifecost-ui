import { addAnswer } from '/imports/mdg/methods';
import { Questions } from '/imports/collections/questionsCollection';
import { Questionnaires } from '/imports/collections/questionnairesCollection';

export function insertQuestionnaire(published, title, date, questions) {
	Questionnaires.insert({
		author: Meteor.userId(),
		title: title,
		questionsList: questions,
		createdAt: new Date(),
		published: published,
		publishedAt: date
	}, (err, res) => {
		if (err) throw new Error(err);
		FlowRouter.go('/questions');
	});
}

export function updateQuestionnaire(id, title, questions) {
	Questionnaires.update(id, {$set: {
		questionsList: questions,
		title: title,
		createdAt: new Date()
	}}, (err, res) => {
		if (err) throw new Error(err);
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
			questions.fetch().forEach(function(item) {
				let index = questionsIds.indexOf(item._id);

				if (index > -1) {
					questionsIds.splice(index, 1);
				}
			});

			return questionsIds;
		}
	}
}

export function questionnaireInsertAnswer(answer, questionId, template) {
	addAnswer.call({answer, questionId}, (err, res) => {
		if (err) throw new Error(err);

		let activeQuestion = template.parent().activeQuestion.get();
		let questionnaire = Questionnaires.findOne(FlowRouter.getParam('id'));

		if (questionnaire !== void 0) {
			let questions = Questions.find({_id: {$in: questionnaire.questionsList}, published: true});

			if (questions.count() > activeQuestion + 1) {
				$('.pagination').find('li').removeClass('active');
				$('.pagination').find('li:nth-child(' + (activeQuestion + 2) + ')').addClass('active');
				template.parent().activeQuestion.set(activeQuestion + 1);
			} else {
				FlowRouter.go('/published-questions');
			}
		}
	});
}

export function updatePublicationQuestionnaire(questionnaireId, published, date) {
	Questionnaires.update(questionnaireId, {$set: {
		published: published,
		publishedAt: date
	}}, (err, res) => {
		if (err) throw new Error(err);
	});
}

export function insertAnswer(answer, questionId) {
	addAnswer.call({answer, questionId}, (err, res) => {
		if (err) throw new Error(err);
	});
}

export function updatePublicationQuestion(questionId, published, date, deprecated) {
	Questions.update(questionId, {$set: {
		published: published,
		publishedDate: date,
		deprecated: deprecated
	}}, (err, res) => {
		if (err) throw new Error(err);
	});
}
