import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {DataSets} from '/imports/api/datasets';

export const dashboardDataSetSideNavCtrl = ['$scope', '$reactive', '$state', 'readState', 'defaultDataSets', '$q', '$timeout',
function ($scope, $reactive, $state, readState, defaultDataSets, $q, $timeout) {
  $reactive(this).attach($scope);
  let self = this;

  this.readState = readState;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    apps: () => Apps.find().fetch(),
    dashboard: () => self.getReactively('app') ? Dashboards.findOne({_id: self.getReactively('app.selectedDashboardId')}) : undefined,
    dashboards: () => self.getReactively('app') ? Dashboards.find({appId: self.getReactively('app._id')}).fetch() : [],
    items: () => self.getReactively('dashboard') ? DataSets.find({dashboardId: self.getReactively('app.selectedDashboardId')}) : [],
    item: () => self.getReactively('dashboard') ? DataSets.findOne({_id: self.getReactively('dashboard.selectedDataSetId')}) : undefined,
    parentItems: () => {
      let pi = [];
      if (self.getReactively('app')) pi.push({
        itemType: 'App',
        selectedId: self.app._id,
        items: self.apps,
        switchItem: (selectedId) => {
          self.user.selectedIds.appId = selectedId;
          // reset all deferredPromises...
          readState.deferredDashboards = $q.defer();
          readState.deferredDataSets = $q.defer();
          readState.deferredVisualizations = $q.defer();
          // now we're ready to update and resubscribe in readCtrl
          Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);}); //update user
          $state.reload('read.developer');
        }
      });
      if (self.getReactively('dashboard')) pi.push({
          itemType: 'Dashboard',
          selectedId: self.dashboard._id,
          items: self.dashboards,
          switchItem: (selectedId) => {
            self.app.selectedDashboardId = selectedId;
            Meteor.call('app.update', self.app._id, self.app, (err, res) => {if (err) alert(err);}); //update user
            $state.reload('read.developer.app.dashboard');
          }
      });
      return pi;
    },
    itemsControl: () => {
      return {
        itemType: "Data Set",
        clonable: false,
        selectedId: self.getReactively('dashboard') ? self.getReactively('dashboard.selectedDataSetId') : undefined,
        selectedItem: self.getReactively('dashboard') ? DataSets.findOne({_id: self.getReactively('dashboard.selectedDataSetId')}) : undefined,
        creatable: () => (self.app && self.dashboard && (! self.user.readOnly)),
        switchItem: (selectedId) => {
          self.dashboard.selectedDataSetId = selectedId;
          Meteor.call('dashboard.update', self.dashboard._id, self.dashboard, (err, res) => {if (err) alert(err);}); //update dashboard
          $state.reload('read.developer.app.dashboard');
        },
        createItem: (dataSetType) => {
          if (! dataSetType) dataSetType = 'raw';
          if (! defaultDataSets[dataSetType]) throw new Error("Unknown dataset type detected in create dataset");
          else {
            let dataSet = angular.merge({
              userId: 'guest',
              appId: self.user.selectedIds.appId,
              dashboardId: self.app.selectedDashboardId,
              dataSetType: dataSetType,
              name: self.itemsControl.itemType + ' ' + self.items.length,
            }, defaultDataSets[dataSetType]);

            Meteor.call('dataSet.create', dataSet, (err, res) => {
              if (err) alert(err);
                self.itemsControl.switchItem(res);
            });
          }
        }
      }
    }
  });

  this.itemControls = {
    itemType: 'Data Set',
    validItem: () => true,
    renameItem: (newName) => {
      self.item.name = newName;
      self.updateDatabase(self.item);
    },
    deletable: () => {
      return ((! self.user.readOnly) && (self.item) && (readState.dependencies.getDerived(self.item._id).length === 0));
    },
    deleteItem: () => {
      Meteor.call('dataSet.delete', self.item._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedDataSet = _.find(self.items, x => (x._id !== self.dashboard.selectedDataSetId));
          // we are updating dashboard but avoiding update of items (or anything else here);
          if (newSelectedDataSet) self.dashboard.selectedDataSetId = newSelectedDataSet._id;
          else delete self.dashboard.selectedDataSetId;
          Meteor.call('dashboard.update', self.dashboard._id, self.dashboard, (err, res) => {if (err) alert(err);});
          $state.reload('read.developer.app.dashboard');
        }
      });
    }
  };

  let watcher = $scope.$watch('sideNavCtrl.item', newVal => {
    if (newVal) {
      self.item.readOnly = self.user.readOnly;
      watcher();
    }
  });

  // update database
  this.updateDatabase = (val) => {
    Meteor.call('dataSet.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

}];
