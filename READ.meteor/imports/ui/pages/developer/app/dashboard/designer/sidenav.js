import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';
import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';

export const dashboardDesignerSideNavCtrl = ['$scope', '$reactive', '$state', 'readState',
function($scope, $reactive, $state, readState) {
  $reactive(this).attach($scope);
  let self = this;

  this.readState = readState;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    dashboard: () => Dashboards.findOne({_id: self.getReactively('app.selectedDashboardId')}),
    items: () => Visualizations.find({dashboardId: self.getReactively('app.selectedDashboardId')}).fetch(),
    item: () => Visualizations.findOne({_id: self.getReactively('dashboard.selectedVisualizationId')}),
    dataSets: () => DataSets.find({dashboardId: self.getReactively('app.selectedDashboardId')}).fetch(),
    templates: () => Playground.find({
      $or: [
        {pluginType: 'NVD3'},
        {pluginType: 'leaflet'}
      ]
    }).fetch()
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
    itemType: "Visualization",
    clonable: false,
    newItemName: undefined,
    selectedId: self.item ? self.item._id : undefined,
    selectedItem: self.item,
    creatable: () => ((self.dashboard) && (self.dataSets.length > 0) && (self.templates.length > 0)),
    switchItem: (selectedId) => {
      self.dashboard.selectedVisualizationId = selectedId;
      Meteor.call('dashboard.update', self.app.selectedDashboardId, self.dashboard, (err, res) => {if (err) alert(err);}); // update dashboard
      $state.reload($state.$current.name);
    },
    createItem: () => {
      let additionalFields = {};
      if (self.templates[0].pluginType === 'NVD3') additionalFields = {
        basicOptions: self.templates[0].basicOptions,
        advancedOptions: self.templates[0].advancedOptions
      };
      Meteor.call('visualization.create', angular.merge({
        userId: 'guest',
        appId: self.user.selectedIds.appId,
        dashboardId: self.app.selectedDashboardId,
        name: self.itemsControl.itemType + ' ' + self.items.length,
        templateId: self.templates[0]._id,
        pluginType: self.templates[0].pluginType,
        dataSetId: self.dataSets[0]._id,
        gridStack: {
          x: 0,
          y: 0,
          height: 3,
          width: 3
        }
      }, additionalFields), (err, res) => {
        if (err) alert(err);
        else {
          self.itemsControl.newItemName = undefined;
          self.itemsControl.switchItem(res);
        }
      });
    }
  };

  this.itemControls = {
    itemType: 'Visualization',
    newItemName: undefined,
    readOnlyable: false,
    validItem: () => true,
    renameItem: () => {
      self.item.name = self.itemControls.newItemName;
      self.updateDatabase(self.item);
      self.itemControls.newItemName = undefined;
      $state.reload($state.$current.name);
    },
    deletable: () => true,
    deleteItem: () => {
      Meteor.call('visualization.delete', self.item._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedVisualization = _.find(self.items, x => (x._id !== self.dashboard.selectedVisualizationId));
          // we are updating dashboard but avoiding update of anything else
          if (newSelectedVisualization) self.dashboard.selectedVisualizationId = newSelectedVisualization._id;
          else {
            delete self.dashboard.selectedVisualizationId;
          }
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
    Meteor.call('visualization.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

}];
