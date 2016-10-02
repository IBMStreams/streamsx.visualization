import {Apps} from '/imports/api/apps.js';

Meteor.publish('apps', function appsPublication(appId) {
  return Apps.find({_id: appId});
});
