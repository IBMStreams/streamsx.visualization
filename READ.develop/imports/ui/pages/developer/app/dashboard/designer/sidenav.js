import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';
import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';

export const dashboardDesignerSideNavCtrl = ['$scope', '$reactive', '$state', 'readState', '$q',
function($scope, $reactive, $state, readState, $q) {
  $reactive(this).attach($scope);
  let self = this;

  this.readState = readState;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    apps: () => Apps.find().fetch(),
    dashboard: () => Dashboards.findOne({_id: self.getReactively('app.selectedDashboardId')}),
    dashboards: () => self.getReactively('app') ? Dashboards.find({appId: self.getReactively('app._id')}).fetch() : [],
    dataSet: () => DataSets.findOne({_id: self.getReactively('dashboard.selectedDataSetId')}),
    dataSets: () => self.getReactively('dashboard') ? DataSets.find({dashboardId: self.getReactively('dashboard._id')}).fetch() : [],
    items: () => self.getReactively('dataSet') ? Visualizations.find({dataSetId: self.getReactively('dataSet._id')}).fetch() : [],
    item: () => Visualizations.findOne({_id: self.getReactively('dataSet.selectedVisualizationId')}),
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
      if (self.getReactively('dataSet')) pi.push({
        itemType: 'Dataset',
        selectedId: self.dataSet._id,
        items: self.dataSets,
        switchItem: (selectedId) => {
          self.dashboard.selectedDataSetId = selectedId;
          Meteor.call('dashboard.update', self.dashboard._id, self.dashboard, (err, res) => {if (err) alert(err);}); //update user
          $state.reload('read.developer.app.dashboard');
        }
      });
      return pi;
    },
    templates: () => Playground.find({
      $or: [
        {pluginType: 'NVD3'},
        {pluginType: 'leaflet'}
      ]
    }).fetch(),
    itemsControl: () => {
      return {
        itemType: "Visualization",
        clonable: false,
        selectedId: self.getReactively('item') ? self.getReactively('item._id') : undefined,
        selectedItem: self.getReactively('item'),
        creatable: () => ((! self.user.readOnly) && (self.dataSet) && (self.templates.length > 0)),
        switchItem: (selectedId) => {
          self.dataSet.selectedVisualizationId = selectedId;
          Meteor.call('dataSet.update', self.dataSet._id, self.dataSet, (err, res) => {
            if (err) alert(err);
            else $state.reload('read.developer.app.dashboard');
          });
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
            dataSetId: self.dataSet._id,
            gridStack: {
              x: 0,
              y: 0,
              height: 4,
              width: 4
            }
          }, additionalFields), (err, res) => {
            if (err) alert(err);
            else {
              self.itemsControl.switchItem(res);
            }
          });
        }
      }
    }
  });

  this.itemControls = {
    itemType: 'Visualization',
    validItem: () => true,
    renameItem: (newName) => {
      self.item.name = newName;
      self.updateDatabase(self.item);
    },
    deletable: () => true,
    deleteItem: () => {
      Meteor.call('visualization.delete', self.item._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedVisualization = _.find(self.items, x => (x._id !== self.dataSet.selectedVisualizationId));
          // we are updating dashboard but avoiding update of anything else
          if (newSelectedVisualization) self.dataSet.selectedVisualizationId = newSelectedVisualization._id;
          else {
            delete self.dataSet.selectedVisualizationId;
          }
          Meteor.call('dataSet.update', self.dataSet._id, self.dataSet, (err, res) => {if (err) alert(err);});
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
    Meteor.call('visualization.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

}];
