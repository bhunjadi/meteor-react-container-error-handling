import { Mongo } from 'meteor/mongo';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    Meteor.publish('tasks', function () {
        const user = Meteor.users.findOne({_id: this.userId});
        if (!user || !user.isAdmin) {
            throw new Meteor.Error('tasks.unauthorized');
        }

        return Tasks.find();
    });
}
