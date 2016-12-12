import {PlaygroundDatasets} from '/imports/api/playgrounddatasets.js';

Meteor.publish('playgrounddatasets', function playgroundDatasetsPublication() {
  return PlaygroundDatasets.find();
});
