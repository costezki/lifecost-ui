import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const Answers = new Mongo.Collection('answers');

let checkboxType = {
	questionId: {
		type: String,
		optional: true
	},
	author: {
		type: 'String',
		optional: true
	},
	answer: {
		type: Array,
		autoform: {
			type: 'select-checkbox-inline'
		},
	},
	'answer.$': {
		type: String
	},
	createdAt: {
		type: Date,
		optional: true
	}
};

let radioButtonType = {
	questionId: checkboxType.questionId,
	author: checkboxType.author,
	createdAt: checkboxType.createdAt,
	answer: {
		type: String,
		autoform: {
			type: 'select-radio-inline'
		}
	}
};

let textType = {
	questionId: checkboxType.questionId,
	author: checkboxType.author,
	createdAt: checkboxType.createdAt,
	answer: {
		type: String,
		max: 2000,
		autoform: {
			type: 'text',
			label: false
		}
	}
};

export class AnswersSchemaFactory {
	constructor(answersType) {
		this.answersType = answersType;
	}

	attachSchema() {
		switch (this.answersType) {
			case 0:
				Answers.attachSchema(new SimpleSchema(checkboxType));
				break;
			case 1:
				Answers.attachSchema(new SimpleSchema(radioButtonType));
				break;
			case 2:
				Answers.attachSchema(new SimpleSchema(textType));
				break;
		}
	}
}
