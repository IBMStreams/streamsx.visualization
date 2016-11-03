import { Meteor } from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import angular from 'angular';
import _ from 'underscore/underscore';

import exportAppModal from './exportappmodal.html';
import importAppModal from './importappmodal.html';
import {importedAppSchema} from '/imports/api/apps'

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';
import {DataSets} from '/imports/api/datasets';

export const appSideNavCtrl = ['$scope', '$reactive', '$state', 'readState', '$q', '$uibModal', '$timeout',
function ($scope, $reactive, $state, readState, $q, $uibModal, $timeout) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    items: () => Apps.find({}).fetch(),
    item: () => Apps.findOne({_id: self.user.selectedIds.appId}),
    exportedItem: () => {
      let exportedApp = {
        version: "0.5.2",
        app: Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
        dashboards: Dashboards.find({appId: self.getReactively('user.selectedIds.appId')}).fetch(),
        dataSets: DataSets.find({appId: self.getReactively('user.selectedIds.appId')}).fetch(),
        visualizations: Visualizations.find({appId: self.getReactively('user.selectedIds.appId')}).fetch(),
      };
      // instead of alert, we want to use ngclipboard to copy stringified json to clipboard here...
      return exportedApp;
    },
    itemsControl: () => {
      return {
        itemType: "App",
        clonable: false,
        selectedId: self.getReactively('user.selectedIds.appId'),
        selectedItem: Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
        exportable: () => ! _.isUndefined(self.getReactively('user.selectedIds.appId')),
        exportItem: () => {
          let modalInstance = $uibModal.open({
            resolve: {
              exportedItem: function() {
                return self.getReactively('exportedItem');
              }
            },
            controller: ['$scope', 'exportedItem', '$uibModalInstance', '$timeout',
            function($scope, exportedItem, $uibModalInstance, $timeout) {
              $scope.exportedItem = JSON.stringify(exportedItem, undefined, 2);
              $uibModalInstance.rendered.then(() => {
                $timeout(() => {
                  if ($scope.exportedItem.length > 0) {
                    angular.element('#exportedItem').scrollTop(0);
                  }
                });
              });

              this.cancel = function() {
                $uibModalInstance.dismiss('cancel');
              };
              $scope.copied = false;
              this.copy = function() {
                $scope.copied = true;
              }
            }],
            controllerAs: 'modalCtrl',
            size: 'lg',
            templateUrl: exportAppModal
          });
          //          alert(JSON.stringify(self.getReactively('exportedItem')));
        },
        importable: () => true,
        importItem: () => {
          let mapAppIds = function(appObj, oldToNew) {
            oldToNew[appObj.app._id] = (new Mongo.ObjectID())._str;
            appObj.dashboards.forEach(d => oldToNew[d._id] = (new Mongo.ObjectID())._str);
            appObj.dataSets.forEach(d => oldToNew[d._id] = (new Mongo.ObjectID())._str);
            appObj.visualizations.forEach(v => oldToNew[v._id] = (new Mongo.ObjectID())._str);
          }

          let fixAppIds = function(appObj, oldToNew) {
            appObj.app._id = oldToNew[appObj.app._id];
            if (appObj.app.selectedDashboardId) appObj.app.selectedDashboardId = oldToNew[appObj.app.selectedDashboardId];
            appObj.dashboards.forEach(d => {
              d._id = oldToNew[d._id];
              d.appId = oldToNew[d.appId];
              if (d.selectedDataSetId) d.selectedDataSetId = oldToNew[d.selectedDataSetId];
            });
            appObj.dataSets.forEach(d => {
              d._id = oldToNew[d._id];
              d.appId = oldToNew[d.appId];
              d.dashboardId = oldToNew[d.dashboardId];
              if (d.selectedVisualizationId) d.selectedVisualizationId = oldToNew[d.selectedVisualizationId];
            });
            appObj.visualizations.forEach(v => {
              v._id = oldToNew[v._id];
              v.appId = oldToNew[v.appId];
              v.dashboardId = oldToNew[v.dashboardId];
              v.dataSetId = oldToNew[v.dataSetId];
            });
          }

          let importApp = function(_importedApp) {
            let importedApp = JSON.parse(_importedApp);
            let oldToNew = {};
            mapAppIds(importedApp, oldToNew);
            fixAppIds(importedApp, oldToNew);

            // meteor insert (not meteor.create) everything in importedApp nos and then switch
            console.log('importedApp', importedApp)
          };

          let modalInstance = $uibModal.open({
            controller: ['$scope', '$uibModalInstance', '$timeout',
            function($scope, $uibModalInstance, $timeout) {
              $scope.appSchema = importedAppSchema;
              $scope.importedItem = undefined;

              this.cancel = function() {
                $uibModalInstance.dismiss('cancel');
              };

              let mod = this;
              this.import = function() {
                importApp($scope.importedItem);
                $timeout(() => {
                  mod.cancel();
                }, 2000);
              };
            }],
            controllerAs: 'modalCtrl',
            size: 'lg',
            templateUrl: importAppModal
          });
        },
        creatable: () => true,
        switchItem: (selectedId) => {
          self.user.selectedIds.appId = selectedId;
          // reset all deferredPromises...
          readState.deferredDashboards = $q.defer();
          readState.deferredDataSets = $q.defer();
          readState.deferredVisualizations = $q.defer();
          // now we're ready to update and resubscribe in readCtrl
          Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);}); //update user
          $state.reload('read.developer');
        },
        createItem: () => {
          Meteor.call('app.create', {
            userId: 'guest',
            name: self.itemsControl.itemType + self.items.length,
            private: true,
            readOnly: false
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
    itemType: 'App',
    validItem: () => true,
    renameItem: (newName) => {
      self.item.name = newName;
      self.updateDatabase(self.item);
    },
    updateItem: () => {
      self.updateDatabase(self.item);
      $state.reload('read.developer.app.dashboard');
    },
    deletable: () => true,
    deleteItem: () => {
      // start by deleting visualizations
      Visualizations.find({appId: self.item._id}).fetch().forEach(visualization => {
        Meteor.call('visualization.delete', visualization._id, (err, res) => {if (err) alert(err);});
      });
      // and dashboards
      Dashboards.find({appId: self.item._id}).fetch().forEach(dashboard => {
        Meteor.call('dashboard.delete', dashboard._id, (err, res) => {if (err) alert(err);});
      });
      // and datasets
      DataSets.find({appId: self.item._id}).fetch().forEach(dataSet => {
        Meteor.call('dataSet.delete', dataSet._id, (err, res) => {if (err) alert(err);});
      });
      // and then delete app...
      Meteor.call('app.delete', self.item._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedItem = _.find(self.items, x => (x._id !== self.user.selectedIds.appId));
          // we are updating user but avoiding update of items (or anything else here);
          if (newSelectedItem) self.user.selectedIds.appId = newSelectedItem._id;
          else delete self.user.selectedIds['appId'];
          Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);});
          $state.reload('read.developer.app.dashboard');
        }
      });
    }
  };

  // update database
  this.updateDatabase = (val) => {
    Meteor.call('app.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

}];
