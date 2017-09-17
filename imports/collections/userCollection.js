import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const UserSettings = new Mongo.Collection('userSettings');

let userSettingsSchema = new SimpleSchema({
    user: {
        type: String,
        autoform: {
            type: 'hidden',
            label: false
        }
    },
    userName: {
        type: String,
        min: 3,
        max: 60,
        label: 'User name:'
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: 'E-mail:',
        autoform: {
            type: 'email'
        }
    },
    birthday: {
        type: Date,
        label: 'Birthday:',
        autoform: {
            type: 'pickadate',
            class: 'with-gap',
            pickadateOptions: {
                closeOnSelect: true,
                closeOnClear: true,
                selectYears: 100,
                selectMonths: true,
                max: new Date()
            }
        },
        autoValue: function () {
            return new Date(this.value);
        }
    },
    country: {
        type: String,
        label: 'Country',
        optional: true,
        autoform: {
            class: 'set-country'
        }
    },
    city: {
        type: String,
        label: 'City',
        optional: true,
        autoform: {
            class: 'set-city'
        }
    },
    location: {
        type: String,
        optional: true,
        autoform: {
            type: 'hidden',
            label: false
        }
    }
});

UserSettings.attachSchema(userSettingsSchema);
