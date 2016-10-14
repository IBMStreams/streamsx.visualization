import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';
import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';

export const dashboardDashboardSideNavCtrl = ['$scope', '$reactive', '$state', 'readState',
function ($scope, $reactive, $state, readState) {
  $reactive(this).attach($scope);
  let self = this;

  this.readState = readState;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    items: () => Dashboards.find({appId: self.getReactively('user.selectedIds.appId')}).fetch(),
    item: () => self.getReactively('app') ? Dashboards.findOne({_id: self.getReactively('app.selectedDashboardId')}) : undefined,
    dataSets: () => self.getReactively('item') ? DataSets.find({dashboardId: self.item._id}).fetch() : [],
    templates: () => Playground.find({
      $or: [
        {pluginType: 'NVD3'},
        {pluginType: 'leaflet'}
      ]
    }).fetch()
  });

  this.itemsControl = {
    itemType: "Dashboard",
    clonable: false,
    newItemName: undefined,
    selectedId: self.app.selectedDashboardId,
    selectedItem: Dashboards.findOne({_id: self.app.selectedDashboardId}),
    creatable: () => (self.app) && (! self.app.readOnly),
    switchItem: (selectedId) => {
      self.app.selectedDashboardId = selectedId;
      Meteor.call('app.update', self.user.selectedIds.appId, self.app, (err, res) => {if (err) alert(err);}); //update user
      $state.reload($state.$current.name);
    },
    createItem: () => {
      Meteor.call('dashboard.create', {
        userId: 'guest',
        appId: self.user.selectedIds.appId,
        name: self.itemsControl.itemType + ' ' + self.items.length,
      }, (err, res) => {
        if (err) alert(err);
        else {
          self.itemsControl.newItemName = undefined;
          self.itemsControl.switchItem(res);
        }
      });
    }
  };

  this.itemControls = {
    itemType: 'Dashboard',
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
      if (self.app.readOnly) return false;
      if (! self.app.private) return false;
      let idsFromThisDashboard = self.dataSets.map(x => x._id);
      let deps = readState.dependencies.getDerived(idsFromThisDashboard).map(x => x.id); // node id vs _id
      return (_.union(deps, idsFromThisDashboard).length === idsFromThisDashboard.length);
    },
    deleteItem: () => {
      // delete visualizations first
      Visualizations.find({dashboardId: self.item._id}).fetch().forEach(visualization => {
        Meteor.call('visualization.delete', visualization._id, (err, res) => {if (err) alert(err);})
      });
      // delete dashboard next
      Meteor.call('dashboard.delete', self.item._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedDashboard = _.find(self.items, x => (x._id !== self.app.selectedDashboardId));
          // we are updating app but avoiding update of dashboards (or anything else here);
          if (newSelectedDashboard) self.app.selectedDashboardId = newSelectedDashboard._id;
          else delete self.app.selectedDashboardlId;
          Meteor.call('app.update', self.app._id, self.app, (err, res) => {if (err) alert(err);});
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
    Meteor.call('dashboard.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

}];
