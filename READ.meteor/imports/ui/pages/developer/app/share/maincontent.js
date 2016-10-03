import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {DataPanels} from '/imports/api/datapanels';
import {DataSets} from '/imports/api/datasets';

export default mainContentCtrl = ['$scope', '$reactive', '$timeout', '$state', 'reactiveDataFactory',
function ($scope, $reactive, $timeout, $state, reactiveDataFactory) {
  $reactive(this).attach($scope);
  let self = this;

  this.user = Users.findOne({});
  this.item = Apps.findOne({_id: self.user.selectedIds.appId});

  let setAppUrl = () => {
    self.item.url = self.user.shareServiceURL.trim();
    var lastChar = self.item.url.substr(-1); // Selects the last character
    if (lastChar != '/') {         // If the last character is not a slash
       self.item.url = self.item.url + '/';            // Append a slash to it.
    }
    self.item.url = self.item.url + '#/app/' + self.item._id;
  };
  if (self.item) setAppUrl();

  // update database
  this.updateDatabase = (val) => {
    Meteor.call('app.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

  this.itemStream = new Rx.ReplaySubject(0);
  $scope.$watch('mainContentCtrl.item', _.debounce(function(item) {
    $scope.$apply(function() {
      self.itemStream.onNext({
        valid: true,
        item: item
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
    console.log(self.user);
    Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);});
    setAppUrl();
  }

}];
