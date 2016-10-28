import {Visualizations} from '/imports/api/visualizations';

Meteor.publish('visualizations', function visualizationsPublication(appId) {
  return Visualizations.find({appId: appId});
});
