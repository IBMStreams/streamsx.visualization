import { Meteor } from 'meteor/meteor';

import _ from 'underscore';

import { Playground } from '/imports/api/playground.js';
import { Users } from '/imports/api/users.js';

export default sideNavCtrl = ['$scope', '$reactive', function($scope, $reactive) {
  $reactive(this).attach($scope);

  this.newApiBridgeName = undefined;
  this.newApiBridgeId = undefined;

  let self = this;

  this.updateUserSelectedApiBridgeId = (apiBridgeId) => {
    Meteor.call('user.update', {
      $set: {
        'selectedIds.apiBridgeId': apiBridgeId
      }
    }, (err, res) => {
      if (err) alert(err);
    });
  };

  this.createApiBridge = () => {
    Meteor.call('playground.create', {
      userId: 'guest',
      pluginType: 'API Bridge',
      name: self.newApiBridgeName
    }, (err, res) => {
      if (err) alert(err);
      else {
        self.newApiBridgeName = undefined;
        self.updateUserSelectedApiBridgeId(res);
      }
    });
  };

  this.helpers({
    apiBridges: () => Playground.find({pluginType: 'API Bridge'}).fetch(),
    userSelectedApiBridgeId: () => {
      let user = Users.findOne();
      if (! _.isUndefined(user)) return user.selectedIds.apiBridgeId;
      else return undefined;
    }
  });

  this.autorun(() => {
    self.selectedApiBridgeId = self.getReactively('userSelectedApiBridgeId'); // update selectedApiBridgeId when user state changes
  });

}];
