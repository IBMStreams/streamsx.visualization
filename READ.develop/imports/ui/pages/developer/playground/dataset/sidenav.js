import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {PlaygroundDatasets} from '/imports/api/playgrounddatasets';

export const playgroundDatasetSideNavCtrl = ['$scope', '$reactive', '$state', '$timeout', 'readState', 'defaultDatasets',
function ($scope, $reactive, $state, $timeout, readState, defaultDatasets) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    datasets: () => PlaygroundDatasets.find().fetch().sort((a, b) => a.position - b.position),
    dataset: () => PlaygroundDatasets.findOne({_id: self.getReactively('user.selectedIds.playgroundDatasetId')}),
    deletableDataset: () => ! self.user.readOnly // and other stuff needs to go here like dependency checks, etc.
  });

  this.createDataset = (datasetType) => {
    if (! datasetType) datasetType = 'Raw';
    if (! defaultDatasets[datasetType]) throw new Error("Unknown dataset type detected in create dataset");
    else {
      let dataset = angular.merge({
        userId: 'guest',
        datasetType: datasetType,
        name: 'PlaygroundDataset ' + self.datasets.length,
        position: self.datasets.length
      }, defaultDatasets[datasetType]);

      Meteor.call('playgroundDataset.create', dataset, (err, res) => {
        if (err) alert(err);
          self.switchDataset(res);
      });
    }
  }

  this.switchDataset = (selectedId) => {
    self.user.selectedIds.playgroundDatasetId = selectedId;
    Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);}); //update user
    $state.reload($state.$current.name);
  }

  // update dataset in database
  this.updateDatabase = (_dataset) => {
    Meteor.call('playgroundDataset.update', _dataset._id, _dataset, (err, res) => {
      if (err) alert(err);
    });
  };

  this.updateDataset = (_dataset) => {
    self.updateDatabase(_dataset);
  }

  this.updateDatasets = () => {
    self.datasets.forEach((_dataset, index) => {
      _dataset.position = index;
      self.updateDataset(_dataset);
    });
  }

  this.sortOptions = {
    items: '.sortable-item',
    cancel: '',
    stop: (event, ui) => {
      self.updateDatasets();
    }
  };

  this.setEditMode = (_dataset) => {
    $( ".sortable-list" ).sortable("disable");
    _dataset.editable = true;
  }

  this.unsetEditMode = (_dataset) => {
    $( ".sortable-list" ).sortable( "enable");
    _dataset.editable = false;
    if ($scope.sideNavForm.$valid) self.updateDataset(_dataset)
    else $state.reload($state.$current.name);
  }

  self.showAreYouSure = false; // no we do not want to delete this dataset... and we don't want to see deletion option...
  this.brieflyShowAreYouSure = () => {
    self.showAreYouSure = true;
    self.briefTimer = $timeout(() => {
      self.showAreYouSure = false;
    }, 3000); // 3 seconds
  };

  this.deleteDataset = () => {
    Meteor.call('playgroundDataset.delete', self.dataset._id, (err, res) => {
      if (err) alert(err);
      else {
        if (self.datasets.length > 0)
        self.user.selectedIds.playgroundDatasetId = _.find(self.datasets, x => (x._id !== self.user.selectedIds.playgroundDatasetId))._id;
        else delete self.user.selectedIds['playgroundDatasetId'];
        Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);});
        $timeout.cancel(self.briefTimer);
        $state.reload($state.$current.name);
      }
    });
  }
}];
