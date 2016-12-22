import {ChartTemplates} from '/imports/api/charttemplates.js';

Meteor.publish('charttemplates', function chartTemplatesPublication() {
  return ChartTemplates.find({});
});
