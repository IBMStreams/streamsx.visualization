import {Dashboards} from '/imports/api/dashboards.js';

Meteor.publish('dashboards', function dashboardsPublication(appId) {
  return Dashboards.find({appId: appId});
});
