import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const Questionnaires = new Mongo.Collection('questionnaires');
