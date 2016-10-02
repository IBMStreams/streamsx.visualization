import {Playground} from '/imports/api/playground.js';

Meteor.publish('playground', function playgroundPublication() {
  return Playground.find({});
});
