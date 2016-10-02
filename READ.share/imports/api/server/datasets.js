import {DataSets} from '/imports/api/datasets.js';

Meteor.publish('datasets', function dataSetsPublication(appId) {
  return DataSets.find({appId: appId});
});
