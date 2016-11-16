import {Plugins} from '/imports/api/plugins.js';

Meteor.publish('plugins', function pluginsPublication() {
  return Plugins.find({});
});
