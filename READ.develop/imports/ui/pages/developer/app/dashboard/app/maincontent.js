import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';
import Rx from 'rx/dist/rx.all';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {DataSets} from '/imports/api/datasets';

export const appCtrl = ['$scope', '$reactive', '$timeout', '$state', 'reactiveDataFactory',
function ($scope, $reactive, $timeout, $state, reactiveDataFactory) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.user.selectedIds.appId})
   })

  this.appUrl = () => {
    let au = self.user.shareServiceURL.trim();
    var lastChar = au.substr(-1); // Selects the last character
    if (lastChar != '/') {         // If the last character is not a slash
       au = au + '/';            // Append a slash to it.
    }
    au = au + '#!/app/' + self.app._id;
    return au;
  };

  if (this.app) this.url = this.appUrl();

  // update database
  this.updateDatabase = (val) => {
    Meteor.call('app.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

  this.itemStream = new Rx.ReplaySubject(0);
  $scope.$watch('appCtrl.app', _.debounce(function(app) {
    $scope.$apply(function() {
      self.itemStream.onNext({
        valid: true,
        item: app
      });
    });
  }, 2), true); // the 2 milli second debounce is for validators and reactive computes to kick in.

  //update database
  self.itemStream
  .skip(1)
  .map(x => x.item)
  .doOnNext(x => {
    self.updateDatabase(x);
  }).subscribe(new Rx.ReplaySubject(0));

  // update user
  this.updateUser = () => {
    Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);});
    self.url = self.appUrl();
  }

}];
