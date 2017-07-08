import { Meteor } from 'meteor/meteor';
import '/imports/mdg/methods';

Meteor.startup(() => {
    // code to run on server at startup
});

Meteor.methods({
    'checkKey'(key) {
        if (key == Meteor.settings.private.secretKey) {
            return true;
        } else {
            return false;
        }
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
    }
});
