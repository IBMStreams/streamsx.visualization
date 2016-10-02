import {Users} from '/imports/api/users.js';

Meteor.publish('users', function usersPublication() {
  return Users.find({});
});
