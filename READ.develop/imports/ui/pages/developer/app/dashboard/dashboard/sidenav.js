import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';
import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';

export const dashboardDashboardSideNavCtrl = ['$scope', '$reactive', '$state', 'readState', '$q',
function ($scope, $reactive, $state, readState, $q) {
  $reactive(this).attach($scope);
  let self = this;

  this.readState = readState;

  this.helpers({
    user: () => Users.findOne({}),
    apps: () => Apps.find().fetch(),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    items: () => self.app ? Dashboards.find({appId: self.getReactively('user.selectedIds.appId')}).fetch() : [],
    item: () => self.getReactively('app') ? Dashboards.findOne({_id: self.getReactively('app.selectedDashboardId')}) : undefined,
    dataSets: () => self.getReactively('item') ? DataSets.find({dashboardId: self.item._id}).fetch() : [],
    visualizations: () => self.getReactively('item') ? Visualizations.find({dashboardId: self.item._id}).fetch() : [],
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
        itemType: "Dashboard",
        clonable: false,
        selectedId: self.getReactively('app') ? self.getReactively('app.selectedDashboardId'): undefined,
        selectedItem: self.getReactively('app') ? Dashboards.findOne({_id: self.getReactively('app.selectedDashboardId')}) : undefined,
        creatable: () => (self.app) && (! self.app.readOnly),
        switchItem: (selectedId) => {
          self.app.selectedDashboardId = selectedId;
          Meteor.call('app.update', self.user.selectedIds.appId, self.app, (err, res) => {if (err) alert(err);}); //update user
          $state.reload('read.developer.app.dashboard');
        },
        createItem: () => {
          Meteor.call('dashboard.create', {
            userId: 'guest',
            appId: self.user.selectedIds.appId,
            name: self.itemsControl.itemType + ' ' + self.items.length,
          }, (err, res) => {
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
    itemType: 'Dashboard',
    validItem: () => true,
    renameItem: (newName) => {
      self.item.name = newName;
      self.updateDatabase(self.item);
    },
    deletable: () => {
      if (self.app.readOnly) return false;
      let idsFromThisDashboard = self.dataSets.map(x => x._id);
      let deps = readState.dependencies.getDerived(idsFromThisDashboard).map(x => x.id); // node id vs _id
      // also remove viz ids from deps
      deps = _.difference(deps, self.visualizations.map(x => x._id));
      return (_.union(deps, idsFromThisDashboard).length === idsFromThisDashboard.length);
    },
    deleteItem: () => {
      // delete visualizations first
      Visualizations.find({dashboardId: self.item._id}).fetch().forEach(visualization => {
        Meteor.call('visualization.delete', visualization._id, (err, res) => {if (err) alert(err);})
      });
      // delete dataSets next
      DataSets.find({dashboardId: self.item._id}).fetch().forEach(dataSet => {
        Meteor.call('dataSet.delete', dataSet._id, (err, res) => {if (err) alert(err);})
      });
      // delete dashboard last
      Meteor.call('dashboard.delete', self.item._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedDashboard = _.find(self.items, x => (x._id !== self.app.selectedDashboardId));
          // we are updating app but avoiding update of dashboards (or anything else here);
          if (newSelectedDashboard) self.app.selectedDashboardId = newSelectedDashboard._id;
          else delete self.app.selectedDashboardlId;
          Meteor.call('app.update', self.app._id, self.app, (err, res) => {if (err) alert(err);});
          $state.reload('read.developer.app.dashboard');
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
    Meteor.call('dashboard.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

}];
