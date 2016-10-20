import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {DataSets} from '/imports/api/datasets';

export const dashboardDataSetSideNavCtrl = ['$scope', '$reactive', '$state', 'readState', 'defaultDataSets',
function ($scope, $reactive, $state, readState, defaultDataSets) {
  $reactive(this).attach($scope);
  let self = this;

  this.readState = readState;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    dashboard: () => self.getReactively('app') ? Dashboards.findOne({_id: self.getReactively('app.selectedDashboardId')}) : undefined,
    items: () => self.getReactively('dashboard') ? DataSets.find({dashboardId: self.getReactively('app.selectedDashboardId')}) : [],
    item: () => self.getReactively('dashboard') ? DataSets.findOne({_id: self.getReactively('dashboard.selectedDataSetId')}) : undefined,
  });

  let parentItems = [];
  if (self.app) parentItems.push({
    itemType: 'App',
    name: self.app.name
  });
  if (self.dashboard) parentItems.push({
    itemType: 'Dashboard',
    name: self.dashboard.name
  });
  this.itemsControl = {
    parentItems: parentItems,
    itemType: "Data Set",
    clonable: false,
    newItemName: undefined,
    selectedId: self.dashboard ? self.dashboard.selectedDataSetId : undefined,
    selectedItem: self.dashboard ? DataSets.findOne({_id: self.dashboard.selectedDataSetId}) : undefined,
    creatable: () => (self.app && self.dashboard && (! self.app.readOnly)),
    switchItem: (selectedId) => {
      self.dashboard.selectedDataSetId = selectedId;
      Meteor.call('dashboard.update', self.dashboard._id, self.dashboard, (err, res) => {if (err) alert(err);}); //update dashboard
      $state.reload($state.$current.name);
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
          else {
            self.itemsControl.newItemName = undefined;
            self.itemsControl.switchItem(res);
          }
        });
      }
    }
  };

  this.itemControls = {
    itemType: 'Data Set',
    newItemName: undefined,
    readOnlyable: false,
    validItem: () => true,
    renameItem: () => {
      self.item.name = self.itemControls.newItemName;
      self.updateDatabase(self.item);
      self.itemControls.newItemName = undefined;
      $state.reload($state.$current.name);
    },
    deletable: () => {
      return ((! self.app.readOnly) && (self.item) && (readState.dependencies.getDerived(self.item._id).length === 0));
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
          $state.reload($state.$current.name);
        }
      });
    }
  };

  let watcher = $scope.$watch('sideNavCtrl.item', newVal => {
    if (newVal) {
      self.item.readOnly = self.app.readOnly;
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
