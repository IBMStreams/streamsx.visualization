import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';

export default mainContentCtrl = ['$scope', '$reactive', 'readState', function($scope, $reactive, readState) {
  $reactive(this).attach($scope);
  let self = this;

  this.user = Users.findOne({});
  this.app = Apps.findOne({_id: self.user.selectedIds.appId});
  this.dashboards = Dashboards.find({appId: self.user.selectedIds.appId}).fetch();
  this.dashboard = Dashboards.findOne({_id: self.app.selectedDashboardId});

  this.dashboardControls = {
    itemType: 'Dashboard',
    newItemName: undefined,
    readOnlyable: false,
    validItem: () => true,
    renameItem: () => {
      self.dashboard.name = self.dashboardControls.newItemName;
      self.updateDatabase(self.dashboard);
      self.newItemName = undefined;
      $state.reload('read.developer.app.dashboard');
    },
    deletable: () => self.app.private,
    deleteItem: () => {
      // delete visualizations first
      Visualizations.find({dashboardId: self.dashboard._id}).fetch().forEach(visualization => {
        Meteor.call('visualization.delete', visualization._id, (err, res) => {if (err) alert(err);})
      });
      // delete dashboard next
      Meteor.call('dashboard.delete', self.dashboard._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedDashboard = _.find(self.dashboards, x => (x._id !== self.dashboard._id));
          // we are updating app but avoiding update of dashboards (or anything else here);
          if (newSelectedDashboard) self.app.selectedDashboardId = newSelectedDashboard._id;
          else delete self.app.selectedDashboardlId;
          Meteor.call('app.update', self.app._id, self.app, (err, res) => {if (err) alert(err);});
          $state.reload('read.developer.app.dashboard');
        }
      });
    }
  };

  let watcher = $scope.$watch('mainContentCtrl.dashboard', newVal => {
    if (newVal) {
      self.dashboard.readOnly = self.app.readOnly;
      watcher();
    }
  });

  // update database
  this.updateDatabase = (val) => {
    Meteor.call('dashboard.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

}];
