import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {DataPanels} from '/imports/api/datapanels';
import {DataSets} from '/imports/api/datasets';

export default dataPanelSideNavCtrl = ['$scope', '$reactive', '$state', 'readState', 'defaultDataSets',
function ($scope, $reactive, $state, readState, defaultDataSets) {
  $reactive(this).attach($scope);
  let self = this;

  this.readState = readState;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    dataPanels: () => DataPanels.find({appId: self.getReactively('user.selectedIds.appId')}).fetch(),
    dataPanel: () => DataPanels.findOne({_id: self.getReactively('app.selectedDataPanelId')}),
    dataSets: () => DataSets.find({dataPanelId: self.getReactively('app.selectedDataPanelId')}).fetch(),
    dataSet: () => DataSets.findOne({_id: self.getReactively('dataPanel.selectedDataSetId')})
  });

  this.dataPanelsControl = {
    itemType: "Data Panel",
    clonable: false,
    newItemName: undefined,
    selectedId: self.app ? self.app.selectedDataPanelId : undefined,
    selectedItem: self.app ? DataPanels.findOne({_id: self.app.selectedDataPanelId}) : undefined,
    creatable: () => (self.app) && (! self.app.readOnly),
    switchItem: (selectedId) => {
      self.app.selectedDataPanelId = selectedId;
      Meteor.call('app.update', self.user.selectedIds.appId, self.app, (err, res) => {if (err) alert(err);}); //update user
      $state.reload('read.developer.app.datapanel');
    },
    createItem: () => {
      Meteor.call('dataPanel.create', {
        userId: 'guest',
        appId: self.user.selectedIds.appId,
        name: self.dataPanelsControl.newItemName
      }, (err, res) => {
        if (err) alert(err);
        else {
          self.dataPanelsControl.newItemName = undefined;
          self.dataPanelsControl.switchItem(res);
        }
      });
    }
  };

  this.dataSetsControl = {
    itemType: "Data Set",
    clonable: false,
    newItemName: undefined,
    selectedId: self.dataPanel ? self.dataPanel.selectedDataSetId : undefined,
    selectedItem: self.dataPanel ? DataSets.findOne({_id: self.dataPanel.selectedDataSetId}) : undefined,
    creatable: () => (self.app && self.dataPanel && (! self.app.readOnly)),
    switchItem: (selectedId) => {
      self.dataPanel.selectedDataSetId = selectedId;
      Meteor.call('dataPanel.update', self.dataPanel._id, self.dataPanel, (err, res) => {if (err) alert(err);}); //update datapanel
      $state.reload('read.developer.app.datapanel');
    },
    createItem: (dataSetType) => {
      if (! dataSetType) dataSetType = 'raw';
      if (! defaultDataSets[dataSetType]) throw new Error("Unknown dataset type detected in create dataset");
      else {
        let dataSet = angular.merge({
          userId: 'guest',
          appId: self.user.selectedIds.appId,
          dataPanelId: self.app.selectedDataPanelId,
          dataSetType: dataSetType,
          name: self.dataSetsControl.newItemName
        }, defaultDataSets[dataSetType]);

        Meteor.call('dataSet.create', dataSet, (err, res) => {
          if (err) alert(err);
          else {
            self.dataSetsControl.newItemName = undefined;
            self.dataSetsControl.switchItem(res);
          }
        });
      }
    }
  };

  this.dataPanelControls = {
    itemType: 'Data Panel',
    newItemName: undefined,
    readOnlyable: false,
    validItem: () => true,
    renameItem: () => {
      self.dataPanel.name = self.dataPanelControls.newItemName;
      self.updateDBDataPanel(self.dataPanel);
      self.newItemName = undefined;
      $state.reload('read.developer.app.datapanel');
    },
    deletable: () => {
      if (self.app.readOnly) return false;
      let idsFromThisPanel = self.dataSets.map(x => x._id);
      let deps = readState.dependencies.getDerived(idsFromThisPanel);
      return (_.union(deps, idsFromThisPanel).length === idsFromThisPanel.length);
    },
    deleteItem: () => {
      // delete datasets first
      DataSets.find({dataPanelId: self.dataPanel._id}).fetch().forEach(dataSet => {
        Meteor.call('dataSet.delete', dataSet._id, (err, res) => {if (err) alert(err);})
      });
      // delete datapanel next
      Meteor.call('dataPanel.delete', self.dataPanel._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedDataPanel = _.find(self.dataPanels, x => (x._id !== self.app.selectedDataPanelId));
          // we are updating app but avoiding update of dataPanels (or anything else here);
          if (newSelectedDataPanel) self.app.selectedDataPanelId = newSelectedDataPanel._id;
          else delete self.app.selectedDataPanelId;
          Meteor.call('app.update', self.app._id, self.app, (err, res) => {if (err) alert(err);});
          $state.reload('read.developer.app.datapanel');
        }
      });
    }
  };

  this.dataSetControls = {
    itemType: 'Data Set',
    newItemName: undefined,
    readOnlyable: false,
    validItem: () => true,
    renameItem: () => {
      self.dataSet.name = self.dataSetControls.newItemName;
      self.updateDBDataSet(self.dataSet);
      self.dataSetControls.newItemName = undefined;
      $state.reload('read.developer.app.datapanel');
    },
    deletable: () => {
      return ((! self.app.readOnly) && (readState.dependencies.getDerived(self.dataSet._id).length === 0));
    },
    deleteItem: () => {
      Meteor.call('dataSet.delete', self.dataSet._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedDataSet = _.find(self.dataSets, x => (x._id !== self.dataPanel.selectedDataSetId));
          // we are updating dataPanel but avoiding update of items (or anything else here);
          if (newSelectedDataSet) self.dataPanel.selectedDataSetId = newSelectedDataSet._id;
          else delete self.dataPanel.selectedDataSetId;
          Meteor.call('dataPanel.update', self.dataPanel._id, self.dataPanel, (err, res) => {if (err) alert(err);});
          $state.reload('read.developer.app.datapanel');
        }
      });
    }
  };

  let dpWatcher = $scope.$watch('sideNavCtrl.dataPanel', newVal => {
    if (newVal) {
      self.dataPanel.readOnly = self.app.readOnly;
      dpWatcher();
    }
  });

  let dsWatcher = $scope.$watch('sideNavCtrl.dataSet', newVal => {
    if (newVal) {
      self.dataSet.readOnly = self.app.readOnly;
      dsWatcher();
    }
  });

  // update database -- datapanel
  this.updateDBDataPanel = (val) => {
    Meteor.call('dataPanel.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

  // update database -- dataset
  this.updateDBDataSet = (val) => {
    Meteor.call('dataSet.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

}];
