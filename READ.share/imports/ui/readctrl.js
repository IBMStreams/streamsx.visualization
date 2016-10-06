import _ from 'underscore';

/* read controller for root state */
import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {DataPanels} from '/imports/api/datapanels';
import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';

export const readCtrl = ['$scope', '$reactive', 'readState', '$location',
function ($scope, $reactive, readState, $location) {
  $reactive(this).attach($scope);
  $scope.readState = readState;
  let self = this;

  this.subscribe('users', null, {
    onReady: () => {
      readState.deferredUser.resolve();
    }
  });

  readState.app._id = $location.path().trim().replace(/\/$/, "").replace(/^\/app\//, "")

  this.subscribe('apps', () => [readState.app._id], {
    onReady: () => {
      readState.deferredApps.resolve();
    }
  });

  this.subscribe('playground', null, {
    onReady: () => {
      readState.deferredPlayground.resolve();
    }
  });

  this.helpers({
    user: () => Users.findOne({})
  });

  this.autorun((c) => {
    if (self.getReactively('user', true)) {
      self.subscribe('datapanels', () => [self.user.selectedIds.appId], {
        onReady: () => {
          readState.deferredDataPanels.resolve();
        }
      });
      self.subscribe('dashboards', () => [self.user.selectedIds.appId], {
        onReady: () => {
          readState.deferredDashboards.resolve();
        }
      });
    }
  });

  this.subscribe('datasets', () => [self.getReactively('user.selectedIds.appId')], {
    onReady: () => {
      readState.deferredDataSets.resolve();
    }
  });

  this.subscribe('visualizations', () => [self.getReactively('user.selectedIds.appId')], {
    onReady: () => {
      readState.deferredVisualizations.resolve();
    }
  });

  let dataSetQuery = DataSets.find({});
  let dataSetQueryHandle = dataSetQuery.observe({
    added: (dataSet) => {
      readState.pipeline.addDataSet(dataSet);
    },
    removed: (dataSet) => {
      readState.pipeline.removeDataSet(dataSet._id);
    },
    changed: (newDataSet, oldDataSet) => { // we can optimize later... // this has to be based on fields not all changes...
      readState.pipeline.changeDataSet(newDataSet);
    }
  });

  readState.deferredApps.promise.then(function() {
    readState.deferredDashboards.promise.then(function() {
      let db = Dashboards.findOne({appId: readState.app._id});
      readState.app.selectedDashboardId = (db ? db._id : undefined);
      readState.app.name = Apps.findOne({_id: readState.app._id}).name;
      readState.app.selectedDashboardName = db.name;
    });
  });

}];
