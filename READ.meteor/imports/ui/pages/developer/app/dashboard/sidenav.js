import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';
import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';

export default sideNavCtrl = ['$scope', '$reactive', '$state', 'readState', function ($scope, $reactive, $state, readState) {
  $reactive(this).attach($scope);
  let self = this;

  this.readState = readState;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    dashboards: () => Dashboards.find({appId: self.getReactively('user.selectedIds.appId')}).fetch(),
    visualizations: () => Visualizations.find({dashboardId: self.getReactively('app.selectedDashboardId')}).fetch(),
    dashboard: () => Dashboards.findOne({_id: self.getReactively('app.selectedDashboardId')}),
    visualization: () => Visualizations.findOne({_id: self.getReactively('dashboard.selectedVisualizationId')}),
    dataSets: () => DataSets.find({appId: self.getReactively('user.selectedIds.appId')}).fetch(),
    templates: () => Playground.find({pluginType: 'NVD3'}).fetch(),
    template: () => Playground.findOne({pluginType: 'NVD3'}) // do a better job of this later...
  });

  this.dashboardsControl = {
    itemType: "Dashboard",
    clonable: false,
    newItemName: undefined,
    selectedId: self.app.selectedDashboardId,
    selectedItem: Dashboards.findOne({_id: self.app.selectedDashboardId}),
    creatable: () => true,
    switchItem: (selectedId) => {
      self.app.selectedDashboardId = selectedId;
      Meteor.call('app.update', self.user.selectedIds.appId, self.app, (err, res) => {if (err) alert(err);}); //update user
      $state.reload('read.developer.app.dashboard');
    },
    createItem: () => {
      Meteor.call('dashboard.create', {
        userId: 'guest',
        appId: self.user.selectedIds.appId,
        name: self.dashboardsControl.newItemName
      }, (err, res) => {
        if (err) alert(err);
        else {
          self.dashboardsControl.newItemName = undefined;
          self.dashboardsControl.switchItem(res);
        }
      });
    }
  };

  this.visualizationsControl = {
    itemType: "Visualization",
    clonable: false,
    newItemName: undefined,
    selectedId: self.dashboard.selectedVisualizationId,
    selectedItem: Visualizations.findOne({_id: self.dashboard.selectedVisualizationId}),
    creatable: () => ((self.dataSets.length > 0) && (self.templates.length > 0)),
    switchItem: (selectedId) => {
      self.dashboard.selectedVisualizationId = selectedId;
      Meteor.call('dashboard.update', self.app.selectedDashboardId, self.dashboard, (err, res) => {if (err) alert(err);}); // update dashboard
      $state.reload('read.developer.app.dashboard');
    },
    createItem: () => {
      console.log('about to call visualization.create');
      Meteor.call('visualization.create', {
        userId: 'guest',
        appId: self.user.selectedIds.appId,
        dashboardId: self.app.selectedDashboardId,
        name: self.visualizationsControl.newItemName,
        templateId: self.templates[0]._id,
        dataSetId: self.dataSets[0]._id,
        basicOptions: self.template.basicOptions,
        advancedOptions: self.template.advancedOptions,
        gridStack: {
          x: 0,
          y: 0,
          height: 3,
          width: 3
        }
      }, (err, res) => {
        if (err) alert(err);
        else {
          self.visualizationsControl.newItemName = undefined;
          self.visualizationsControl.switchItem(res);
        }
      });
    }
  };

  this.dashboardControls = {
    itemType: 'Dashboard',
    newItemName: undefined,
    readOnlyable: false,
    validItem: () => true,
    renameItem: () => {
      self.dashboard.name = self.dashboardControls.newItemName;
      self.updateDBDashboard(self.dashboard);
      self.dashboardControls.newItemName = undefined;
      $state.reload('read.developer.app.dashboard');
    },
    deletable: () => (self.app.private && ! self.dashboard.readOnly),
    deleteItem: () => {
      // delete visualizations first
      Visualizations.find({dashboardId: self.dashboard._id}).fetch().forEach(visualization => {
        Meteor.call('visualization.delete', visualization._id, (err, res) => {if (err) alert(err);})
      });
      // delete dashboard next
      Meteor.call('dashboard.delete', self.dashboard._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedDashboard = _.find(self.dashboards, x => (x._id !== self.app.selectedDashboardId));
          // we are updating app but avoiding update of dashboards (or anything else here);
          if (newSelectedDashboard) self.app.selectedDashboardId = newSelectedDashboard._id;
          else delete self.app.selectedDashboardlId;
          Meteor.call('app.update', self.app._id, self.app, (err, res) => {if (err) alert(err);});
          $state.reload('read.developer.app.dashboard');
        }
      });
    }
  };

  this.visualizationControls = {
    itemType: 'Visualization',
    newItemName: undefined,
    readOnlyable: false,
    validItem: () => true,
    renameItem: () => {
      self.visualization.name = self.visualizationControls.newItemName;
      self.updateDBVisualization(self.visualization);
      self.visualizationControls.newItemName = undefined;
      $state.reload('read.developer.app.dashboard');
    },
    deletable: () => self.app.private,
    deleteItem: () => {
      console.log('about to delete visualization');
      console.log(self.visualization);
      console.log(self.getReactively('visualization._id'));
      Meteor.call('visualization.delete', self.visualization._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedVisualization = _.find(self.visualizations, x => (x._id !== self.dashboard.selectedVisualizationId));
          // we are updating dashboard but avoiding update of anything else
          if (newSelectedVisualization) self.dashboard.selectedVisualizationId = newSelectedVisualization._id;
          else {
            delete self.dashboard.selectedVisualizationId;
            console.log('deleted visualization successfully and also selectedVisualizationId');
          }
          Meteor.call('dashboard.update', self.dashboard._id, self.dashboard, (err, res) => {if (err) alert(err);});
          $state.reload('read.developer.app.dashboard');
        }
      });
    }
  };

  let dbWatcher = $scope.$watch('mainContentCtrl.dashboard', newVal => {
    if (newVal) {
      self.dashboard.readOnly = self.app.readOnly;
      dbWatcher();
    }
  });

  let vizWatcher = $scope.$watch('mainContentCtrl.visualization', newVal => {
    if (newVal) {
      self.visualization.readOnly = self.app.readOnly;
      vizWatcher();
    }
  });

  // update database
  this.updateDBDashboard = (val) => {
    Meteor.call('dashboard.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

  // update database
  this.updateDBVisualization = (val) => {
    Meteor.call('visualization.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

}];
