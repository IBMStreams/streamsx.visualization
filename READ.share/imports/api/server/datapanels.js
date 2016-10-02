import {DataPanels} from '/imports/api/datapanels.js';

Meteor.publish('datapanels', function dataPanelsPublication(appId) {
  return DataPanels.find({appId: appId});
});
