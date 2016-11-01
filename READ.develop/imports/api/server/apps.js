import {Apps} from '/imports/api/apps.js';

Meteor.publish('apps', function appsPublication() {
  return Apps.find({});
});
